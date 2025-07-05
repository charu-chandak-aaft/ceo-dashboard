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

    if (!organisationId) {
      return NextResponse.json({ error: "organisationId is required" }, { status: 400 });
    }

    // Prepare buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      range: 6,
      defval: "",
    });

    // Extract date from the first row
    const dateInSheet = sheetData?.[0]?.Date;
    if (!dateInSheet) {
      return NextResponse.json({ error: "No date found in uploaded file" }, { status: 400 });
    }

    // Check for existing data
    const dataExist = await School.find({ organisationId, date: dateInSheet });
    if (dataExist && dataExist.length > 0) {
      return NextResponse.json({ error: "Data already exist in the DB table" }, { status: 400 });
    }

    // Save file temporarily
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Parse and save data
    const parsedData = parseExcelData(sheetData, organisationId);
    await storeParsedAttendance(parsedData);

    // Clean up
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

    // Staff
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

    // Subject
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

  // Insert Semesters
  for (const key in semesterGrouped) {
    const sem = semesterGrouped[key];
    await Semester.create(sem);
  }

  // Insert Programs
  for (const key in programGrouped) {
    const prog = programGrouped[key];
    await Program.create(prog);
  }

  // Insert Schools
  for (const key in schoolGrouped) {
    const sch = schoolGrouped[key];
    await School.create(sch);
  }
}
