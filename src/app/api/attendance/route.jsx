import { promises as fs } from "fs"; 
import path from "path";
import * as xlsx from "xlsx";

let globalAttendanceData = null;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "uploads", "attendance.xlsx");

    try {
      await fs.access(filePath);
    } catch (err) {
      return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    if (data.length < 8) {
      return new Response(JSON.stringify({ error: "Invalid Excel format" }), { status: 400 });
    }

    const rows = data.slice(7).map((row) => ({
      school: row[6],
      program: row[5],
      semester: row[7],
      subject: row[9],
      totalStudents: row[13],
      presentStudents: row[14],
      absentStudents: row[15],
    }));

    const summary = {
      date: "01-04-2025",
      schools: {},
    };

    rows.forEach(({ school, program, semester, subject, totalStudents, presentStudents, absentStudents }) => {
      if (!summary.schools[school]) {
        summary.schools[school] = { total_actual: 0, total_present: 0, total_absent: 0, programs: {} };
      }
      if (!summary.schools[school].programs[program]) {
        summary.schools[school].programs[program] = { total_actual: 0, total_present: 0, total_absent: 0, semesters: {} };
      }
      if (!summary.schools[school].programs[program].semesters[semester]) {
        summary.schools[school].programs[program].semesters[semester] = {
          total_actual: 0,
          total_present: 0,
          total_absent: 0,
          subjects: {},
        };
      }
      if (!summary.schools[school].programs[program].semesters[semester].subjects[subject]) {
        summary.schools[school].programs[program].semesters[semester].subjects[subject] = {
          actual: 0,
          present: 0,
          absent: 0,
          
        };
      }

      summary.schools[school].total_actual += totalStudents;
      summary.schools[school].total_present += presentStudents;
      summary.schools[school].total_absent += absentStudents;

      summary.schools[school].programs[program].total_actual += totalStudents;
      summary.schools[school].programs[program].total_present += presentStudents;
      summary.schools[school].programs[program].total_absent += absentStudents;

      summary.schools[school].programs[program].semesters[semester].total_actual += totalStudents;
      summary.schools[school].programs[program].semesters[semester].total_present += presentStudents;
      summary.schools[school].programs[program].semesters[semester].total_absent += absentStudents;

      summary.schools[school].programs[program].semesters[semester].subjects[subject].actual += totalStudents;
      summary.schools[school].programs[program].semesters[semester].subjects[subject].present += presentStudents;
      summary.schools[school].programs[program].semesters[semester].subjects[subject].absent += absentStudents;
    });

    globalAttendanceData = { data: summary };

    // console.log("📌 Attendance Data Processed:", globalAttendanceData);
    return new Response(JSON.stringify(globalAttendanceData), { status: 200 });
  } catch (error) {
    console.error("❌ Error processing file:", error);
    return new Response(JSON.stringify({ error: "File processing failed", details: error.message }), { status: 500 });
  }
}

export async function POST() {
  if (!globalAttendanceData) {
    return new Response(JSON.stringify({ error: "No attendance data available" }), { status: 404 });
  }
  return new Response(JSON.stringify(globalAttendanceData), { status: 200 });
}