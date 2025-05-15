import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import connectToDatabase from "../../../../lib/mongoose";
import School from "../../../../lib/models/Schools";
import Program from "../../../../lib/models/Programs";
import Semester from "../../../../lib/models/Semesters";
import Subject from "../../../../lib/models/Subjects";
import Staff from "../../../../lib/models/Staff";
import { CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL } from "next/dist/shared/lib/constants";


export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file");
    const organisationId = formData.get("organisationId");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      range: 6,
      defval: "",
    });

    const parsedData = parseExcelData(sheetData, organisationId);
    await storeParsedAttendance(parsedData);
    await fs.unlink(filepath);
    return NextResponse.json({ message: "Attendance uploaded successfully!" });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function parseExcelData(sheetData, organisationId) {
  const parsed = [];

  sheetData.forEach(row => {
    const date = row["Date"];
    const schoolName = row["Department"];
    const programName = row["Course"];
    const semesterName = row["Semester"];
    const subjectName = row["Subject"];
    const staff_id = row["Staff ID"];
    const staff_name = row["Staff Name"];
    const attendance_status = row["Status"];
    const actual = Number(row["Student Actual count"]) || 0;
    const present = Number(row["Student Present count"]) || 0;
    const absent = Number(row["Student Absent count"]) || 0;

    if (!date || !schoolName || !programName || !semesterName || !subjectName || !attendance_status) return;

    parsed.push({
      organisationId,
      date,
      schoolName,
      programName,
      semesterName,
      subjectName,
      attendance_status,
      actual,
      present,
      absent,
      staff_id,
      staff_name,
    });
  });

  return parsed;
}

// async function storeParsedAttendance(rows) {
//   const grouped = {};
//   for (const row of rows) {
//     const key = `${row.organisationId}-${row.date}-${row.staff_id}-${row.subjectName}-${row.attendance_status}`;
//     if (!grouped[key]) grouped[key] = { ...row, staffs: [] };

//     grouped[key].staffs.push({
//       staff_id: row.staff_id,
//       staff_name: row.staff_name,
//       subjectName: row.subjectName,
//       attendance_status: row.attendance_status,
//       actual: row.actual,
//       present: row.present,
//       absent: row.absent,
//     });
//   }

//   for (const key in grouped) {
//     const group = grouped[key];
//     const { organisationId, date, staffs } = group;

//     for (const data of staffs) {
//       if (!data.staff_id || !data.staff_name) continue;

//       try {
//         await Staff.create({
//           organisationId,
//           date,
//           subjectName: data.subjectName,
//           actual: data.actual,
//           present: data.present,
//           absent: data.absent,
//           staff_id: data.staff_id,
//           staff_name: data.staff_name,
//           attendance_status: data.attendance_status === "Attendance not taken" ? false : true,
//         });
//       } catch (err) {
//         console.error(`Failed to insert staff record for staff_id=${data.staff_id}`, err.message);
//       }
//     }
//   }
// //   

//   for (const row of rows) {
//     const key = `${row.organisationId}-${row.date}-${row.schoolName}-${row.programName}-${row.semesterName}`;
//     if (!grouped[key]) grouped[key] = { ...row, subjects: [] };

//     grouped[key].subjects.push({
//       name: row.subjectName,
//       actual: row.actual,
//       present: row.present,
//       absent: row.absent,
//       staff_id: row.staff_id,
//       staff_name: row.staff_name,
//     });
//   }

//   for (const key in grouped) {
//     const group = grouped[key];
//     const { organisationId, date, schoolName, programName, semesterName, subjects } = group;

//     const semesterStats = subjects.reduce((acc, sub) => {
//       acc.actual += sub.actual;
//       acc.present += sub.present;
//       acc.absent += sub.absent;
//       return acc;
//     }, { actual: 0, present: 0, absent: 0 });

//     // Insert into Subject collection
//     for (const sub of subjects) {
//       await Subject.create({
//         organisationId,
//         date,
//         schoolName,
//         programName,
//         semesterName,
//         name: sub.name,
//         actual: sub.actual,
//         present: sub.present,
//         absent: sub.absent,
//         staff_id: sub.staff_id,
//         staff_name: sub.staff_name,
//       });
//     }

//     // Insert into Semester
//     await Semester.create({
//       organisationId,
//       date,
//       name: semesterName,
//       schoolName,
//       programName,
//       total_actual: semesterStats.actual,
//       total_present: semesterStats.present,
//       total_absent: semesterStats.absent,
//     });

//     // Accumulate for program
//     const programKey = `${organisationId}-${date}-${schoolName}-${programName}`;
//     if (!grouped[programKey]) {
//       grouped[programKey] = {
//         organisationId,
//         date,
//         name: programName,
//         schoolName,
//         total_actual: 0,
//         total_present: 0,
//         total_absent: 0,
//       };
//     }

//     grouped[programKey].total_actual += semesterStats.actual;
//     grouped[programKey].total_present += semesterStats.present;
//     grouped[programKey].total_absent += semesterStats.absent;
//   }

//   // Insert Program + School totals
//   for (const key in grouped) {
//     const g = grouped[key];

//     if (g.name && g.total_actual !== undefined && g.programName === undefined) {
//       await Program.create({
//         organisationId: g.organisationId,
//         date: g.date,
//         name: g.name,
//         schoolName: g.schoolName,
//         total_actual: g.total_actual,
//         total_present: g.total_present,
//         total_absent: g.total_absent,
//       });

//       const schoolKey = `${g.organisationId}-${g.date}-${g.schoolName}`;
//       if (!grouped[schoolKey]) {
//         grouped[schoolKey] = {
//           organisationId: g.organisationId,
//           date: g.date,
//           name: g.schoolName,
//           total_actual: 0,
//           total_present: 0,
//           total_absent: 0,
//         };
//       }

//       grouped[schoolKey].total_actual += g.total_actual;
//       grouped[schoolKey].total_present += g.total_present;
//       grouped[schoolKey].total_absent += g.total_absent;
//     }
//   }

//   // Final insert of schools
//   for (const key in grouped) {
//     const g = grouped[key];
//     // console.log("school group", g);
//     if (g.name && g.schoolName === undefined && g.semesterName === undefined) {
//       await School.create({
//         organisationId: g.organisationId,
//         date: g.date,
//         name: g.name,
//         total_actual: g.total_actual,
//         total_present: g.total_present,
//         total_absent: g.total_absent,
//       });
//     }
//   }
// }



async function storeParsedAttendance(rows) {
    const staffGrouped = {};
    const subjectGrouped = {};
    const semesterGrouped = {};
    const programGrouped = {};
    const schoolGrouped = {};
  
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
  
      // ✅ Staff
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
            attendance_status: attendance_status === "Attendance not taken" ? false : true,
          });
          staffGrouped[staffKey] = true;
        } catch (err) {
          console.error(`Failed to insert staff record for staff_id=${staff_id}`, err.message);
        }
      }
  
      // ✅ Subject
      const subjectKey = `${organisationId}-${date}-${subjectName}-${semesterName}`;
      if (!subjectGrouped[subjectKey]) {
        await Subject.create({
          organisationId,
          date,
          schoolName,
          programName,
          semesterName,
          name: subjectName,
          actual,
          present,
          absent,
          staff_id,
          staff_name,
        });
        subjectGrouped[subjectKey] = true;
      }
  
      // ✅ Semester Aggregation
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
  
      // ✅ Program Aggregation
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
  
      // ✅ School Aggregation
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
  
    // ✅ Insert into Semester
    for (const key in semesterGrouped) {
      const sem = semesterGrouped[key];
      await Semester.create(sem);
    }
  
    // ✅ Insert into Program
    for (const key in programGrouped) {
      const prog = programGrouped[key];
      await Program.create(prog);
    }
  
    // ✅ Insert into School
    for (const key in schoolGrouped) {
      const sch = schoolGrouped[key];
      await School.create(sch);
    }
  }
  
