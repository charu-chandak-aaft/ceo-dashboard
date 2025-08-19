import axios from "axios";
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import School from "../../../../lib/models/Schools";
import Program from "../../../../lib/models/Programs";
import Semester from "../../../../lib/models/Semesters";
import Subject from "../../../../lib/models/Subjects";
import Staff from "../../../../lib/models/Staff";

export async function GET() {
  try {
    await connectToDatabase();

    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];

    // Call the API with POST and pass date in body
    const res = await axios.post(
      "https://staff.aaft.com/analytics/attendance/aggregatedstats",
      {
        date: formattedDate, 
      },
      {
        headers: {
          "Content-Type": "application/json",
          "API-Key": '2H7_AHD6sYEQ8Fi2JVZHbrLRjiMp18jIKYpMRVFPSPI' ,
        },
      }
    );

    const data = res.data;
     const organisationId = "67f4172c7d0948b743254577";
    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, message: "No data received." }, { status: 204 });
    }
     const parsed = data.flat().map((entry) => ({
      organisationId: organisationId || null,
      date: formatDate(formattedDate),
      schoolName: entry.Department || '',
      programName: entry.Course || '',
      semesterName: entry.SemesterName || '',
    //   subjectName: entry.Subject || '',
     subjectName: `${entry.SubjectCode || ''} - ${entry.Subject || ''}`,
      attendance_status: entry.AttendanceStatus || '',
      actual: entry.Total_Count || 0,
      present: entry.Present_Count || 0,
      absent: entry.Absent_Count || 0,
      staff_id: entry.FacultyID || '',
      staff_name: entry.Faculty || '',
    }));
    // if (!date || !schoolName || !programName || !semesterName || !subjectName || !attendance_status) return;
    const dataExist = await School.find({
  organisationId,
  date: formatDate(formattedDate),
});

if (dataExist && dataExist.length > 0) {
  return NextResponse.json(
    { error: "Data already exists in the DB table" },
    { status: 400 }
  );
}
   
    await storeParsedAttendance(parsed);

    return NextResponse.json({ success: true, message: "Data stored successfully.", parseddata: parsed, });
  } catch (error) {
    console.error("Error while fetching or storing data:", error.message);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
//   async function storeParsedAttendance(rows) {
//   const staffGrouped = {};
//   const subjectGrouped = {};
//   const semesterGrouped = {};
//   const programGrouped = {};
//   const schoolGrouped = {};

//   for (const row of rows) {
//     const {
//       organisationId,
//       date,
//       schoolName,
//       programName,
//       semesterName,
//       subjectName,
//       staff_id,
//       staff_name,
//       attendance_status,
//       actual,
//       present,
//       absent,
//     } = row;
//     console.log('rows', row);
//     // Staff
//     const staffKey = `${organisationId}-${date}-${staff_id}-${subjectName}`;
//     if (!staffGrouped[staffKey]) {
//       try {
//         await Staff.create({
//           organisationId,
//           date,
//           subjectName,
//           actual,
//           present,
//           absent,
//           staff_id,
//           staff_name,
//           attendance_status: attendance_status,
//         });
//         staffGrouped[staffKey] = true;
//       } catch (err) {
//         console.error(`Failed to insert staff record for staff_id=${staff_id}`, err.message);
//       }
//     }

//     // Subject
//     const subjectKey = `${organisationId}-${date}-${subjectName}-${semesterName}`;
//     if (!subjectGrouped[subjectKey]) {
//       await Subject.create({
//         organisationId,
//         date,
//         schoolName,
//         programName,
//         semesterName,
//         name: subjectName,
//         actual,
//         present,
//         absent,
//         staff_id,
//         staff_name,
//       });
//       subjectGrouped[subjectKey] = true;
//     }

//     // Semester
//     const semesterKey = `${organisationId}-${date}-${semesterName}-${programName}`;
//     if (!semesterGrouped[semesterKey]) {
//       semesterGrouped[semesterKey] = {
//         organisationId,
//         date,
//         name: semesterName,
//         schoolName,
//         programName,
//         total_actual: 0,
//         total_present: 0,
//         total_absent: 0,
//       };
//     }
//     semesterGrouped[semesterKey].total_actual += actual;
//     semesterGrouped[semesterKey].total_present += present;
//     semesterGrouped[semesterKey].total_absent += absent;

//     // Program
//     const programKey = `${organisationId}-${date}-${programName}-${schoolName}`;
//     if (!programGrouped[programKey]) {
//       programGrouped[programKey] = {
//         organisationId,
//         date,
//         name: programName,
//         schoolName,
//         total_actual: 0,
//         total_present: 0,
//         total_absent: 0,
//       };
//     }
//     programGrouped[programKey].total_actual += actual;
//     programGrouped[programKey].total_present += present;
//     programGrouped[programKey].total_absent += absent;

//     // School
//     const schoolKey = `${organisationId}-${date}-${schoolName}`;
//     if (!schoolGrouped[schoolKey]) {
//       schoolGrouped[schoolKey] = {
//         organisationId,
//         date,
//         name: schoolName,
//         total_actual: 0,
//         total_present: 0,
//         total_absent: 0,
//       };
//     }
//     schoolGrouped[schoolKey].total_actual += actual;
//     schoolGrouped[schoolKey].total_present += present;
//     schoolGrouped[schoolKey].total_absent += absent;
//   }

//   // Insert Semesters
//   for (const key in semesterGrouped) {
//     await Semester.create(semesterGrouped[key]);
//   }

//   // Insert Programs
//   for (const key in programGrouped) {
//     await Program.create(programGrouped[key]);
//   }

//   // Insert Schools
//   for (const key in schoolGrouped) {
//     await School.create(schoolGrouped[key]);
//   }
// }
async function storeParsedAttendance(rows) {
  const staffGrouped = {};
  const subjectGrouped = {};
  const semesterGrouped = {};
  const programGrouped = {};
  const schoolGrouped = {};
  const subjectAggregation = {}; // 🔸 NEW

  for (const row of rows) {
    const {
      organisationId,
      date,
      schoolName,
      programName,
      semesterName,
      subjectName,
      staff_id,
      staff_name,
      attendance_status,
      actual,
      present,
      absent,
    } = row;

    const staffKey = `${organisationId}-${date}-${staff_id}-${subjectName}`;
    if (!staffGrouped[staffKey]) {
      try {
        await Staff.create({
          organisationId,
          date,
          subjectName,
          actual,
          present,
          absent,
          staff_id,
          staff_name,
          attendance_status: attendance_status,
        });
        staffGrouped[staffKey] = true;
      } catch (err) {
        console.error(`Failed to insert staff record for staff_id=${staff_id}`, err.message);
      }
    }

    // 🔸 Aggregate Subject Entries with attendance_status true
    const subjectKey = `${organisationId}-${date}-${subjectName}-${semesterName}`;
    if (attendance_status !== "Attendance not taken") {
      if (!subjectAggregation[subjectKey]) {
        subjectAggregation[subjectKey] = {
          organisationId,
          date,
          schoolName,
          programName,
          semesterName,
          name: subjectName,
          actual: actual || 0,
          present: present || 0,
          absent: absent || 0,
          staff_id,
          staff_name,
        };
      } else {
        subjectAggregation[subjectKey].actual += actual || 0;
        subjectAggregation[subjectKey].present += present || 0;
        subjectAggregation[subjectKey].absent += absent || 0;
      }
    }

    // Semester
    const semesterKey = `${organisationId}-${date}-${semesterName}-${programName}`;
    if (!semesterGrouped[semesterKey]) {
      semesterGrouped[semesterKey] = {
        organisationId,
        date,
        name: semesterName,
        schoolName,
        programName,
        total_actual: 0,
        total_present: 0,
        total_absent: 0,
      };
    }
    semesterGrouped[semesterKey].total_actual += actual;
    semesterGrouped[semesterKey].total_present += present;
    semesterGrouped[semesterKey].total_absent += absent;

    // Program
    const programKey = `${organisationId}-${date}-${programName}-${schoolName}`;
    if (!programGrouped[programKey]) {
      programGrouped[programKey] = {
        organisationId,
        date,
        name: programName,
        schoolName,
        total_actual: 0,
        total_present: 0,
        total_absent: 0,
      };
    }
    programGrouped[programKey].total_actual += actual;
    programGrouped[programKey].total_present += present;
    programGrouped[programKey].total_absent += absent;

    // School
    const schoolKey = `${organisationId}-${date}-${schoolName}`;
    if (!schoolGrouped[schoolKey]) {
      schoolGrouped[schoolKey] = {
        organisationId,
        date,
        name: schoolName,
        total_actual: 0,
        total_present: 0,
        total_absent: 0,
      };
    }
    schoolGrouped[schoolKey].total_actual += actual;
    schoolGrouped[schoolKey].total_present += present;
    schoolGrouped[schoolKey].total_absent += absent;
  }

  // 🔸 Insert Aggregated Subjects
  for (const key in subjectAggregation) {
    await Subject.create(subjectAggregation[key]);
  }

  // Insert Semesters
  for (const key in semesterGrouped) {
    await Semester.create(semesterGrouped[key]);
  }

  // Insert Programs
  for (const key in programGrouped) {
    await Program.create(programGrouped[key]);
  }

  // Insert Schools
  for (const key in schoolGrouped) {
    await School.create(schoolGrouped[key]);
  }
}
function formatDate(inputDate) {
  if (!inputDate) return '';

  return new Date(inputDate)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-');
}
}
