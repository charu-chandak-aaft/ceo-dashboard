import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import connectToDatabase from "../../../../lib/mongoose";
import Attendance from "../../../../lib/models/Attendance";

// Disable Next.js body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        await connectToDatabase();

        // 1. Read form data
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. Store file temporarily
        const filename = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        await fs.mkdir(uploadDir, { recursive: true });
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        // console.log("filepath", filepath)
        // // 3. Parse Excel
        // const workbook = XLSX.readFile(filepath);
        // const bytes = await file.arrayBuffer();
        // const buffer = Buffer.from(bytes);

        // ✅ Use buffer directly
        const workbook = XLSX.read(buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        // const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            range: 6,     // skip first 6 rows (0-based index; 7th row is header)
            defval: "",   // ensures empty cells aren't dropped
        });

        if (!sheetData || sheetData.length === 0) {
            return NextResponse.json({ error: "No attendance data available" }, { status: 404 });
        }
        console.log("sheetData", sheetData);
        // console.log("Raw Headers:", Object.keys(sheetData[8]));
        const parsedData = parseExcelData(sheetData);
        // console.log("parseData", parsedData)
        await storeAttendance(parsedData);

        // 4. Delete file
        // await fs.unlink(filepath);

        return NextResponse.json({ message: "Data uploaded successfully" });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// function parseExcelData(sheetData) {
//     const attendanceData = {};

//     sheetData.forEach((row) => {
//         const date = row["Date"];
//         const schoolName = row[6];
//         const programName = row[5];
//         const semesterName = row[7];
//         const subjectName = row[9];

//         if (!attendanceData[date]) attendanceData[date] = { date, schools: {} };
//         const school = attendanceData[date].schools;

//         if (!school[schoolName])
//             school[schoolName] = {
//                 name: schoolName,
//                 total_actual: 0,
//                 total_present: 0,
//                 total_absent: 0,
//                 programs: {},
//             };

//         const program = school[schoolName].programs;
//         if (!program[programName])
//             program[programName] = {
//                 name: programName,
//                 total_actual: 0,
//                 total_present: 0,
//                 total_absent: 0,
//                 semesters: {},
//             };

//         const semester = program[programName].semesters;
//         if (!semester[semesterName])
//             semester[semesterName] = {
//                 name: semesterName,
//                 total_actual: 0,
//                 total_present: 0,
//                 total_absent: 0,
//                 subjects: [],
//             };

//         semester[semesterName].subjects.push({
//             name: subjectName,
//             actual: row[13],
//             present: row[14],
//             absent: row[15],
//         });

//         semester[semesterName].total_actual += row["Actual"];
//         semester[semesterName].total_present += row["Present"];
//         semester[semesterName].total_absent += row["Absent"];

//         program[programName].total_actual += row["Actual"];
//         program[programName].total_present += row["Present"];
//         program[programName].total_absent += row["Absent"];

//         school[schoolName].total_actual += row["Actual"];
//         school[schoolName].total_present += row["Present"];
//         school[schoolName].total_absent += row["Absent"];
//     });

//     return Object.values(attendanceData);
// }



function parseExcelData(sheetData) {
    const attendanceData = {};

    sheetData.forEach((row) => {
        const date = row["Date"];
        const schoolName = row["Department"];
        const programName = row["Course"];
        const semesterName = row["Semester"];
        const subjectName = row["Subject"];
        const actual = Number(row["Student Actual count"]) || 0;
        const present = Number(row["Student Present count"]) || 0;
        const absent = Number(row["Student Absent count"]) || 0;
        const staff_id = row["Staff ID"];
        const staff_name = row["Staff Name"];

        if (!date || !schoolName || !programName || !semesterName || !subjectName) {
            console.warn("Skipping incomplete row", row);
            return;
        }

        if (!attendanceData[date]) attendanceData[date] = { date, schools: {} };
        const school = attendanceData[date].schools;

        if (!school[schoolName])
            school[schoolName] = {
                name: schoolName,
                total_actual: 0,
                total_present: 0,
                total_absent: 0,
                programs: {},
            };

        const program = school[schoolName].programs;
        if (!program[programName])
            program[programName] = {
                name: programName,
                total_actual: 0,
                total_present: 0,
                total_absent: 0,
                semesters: {},
            };

        const semester = program[programName].semesters;
        if (!semester[semesterName])
            semester[semesterName] = {
                name: semesterName,
                total_actual: 0,
                total_present: 0,
                total_absent: 0,
                subjects: [],
            };

        semester[semesterName].subjects.push({
            name: subjectName,
            actual,
            present,
            absent,
            staff_id: staff_id,
            staff_name: staff_name,
        });

        semester[semesterName].total_actual += actual;
        semester[semesterName].total_present += present;
        semester[semesterName].total_absent += absent;

        program[programName].total_actual += actual;
        program[programName].total_present += present;
        program[programName].total_absent += absent;

        school[schoolName].total_actual += actual;
        school[schoolName].total_present += present;
        school[schoolName].total_absent += absent;
    });

    return Object.values(attendanceData);
}



// async function storeAttendance(attendanceData) {
//     console.log("store attendance", attendanceData);
//     for (const entry of attendanceData) {
//         await Attendance.findOneAndUpdate(
//             { date: entry.date },
//             { $set: { schools: Object.values(entry.schools) } },
//             { upsert: true }
//         );
//     }
// }

function sanitizeKeys(obj) {
    if (Array.isArray(obj)) {
        // If it's an array of subjects (with 'name'), convert to map
        if (obj.every(item => item && typeof item === 'object' && 'name' in item)) {
            return Object.fromEntries(
                obj.map(({ name, ...rest }) => [
                    name.replace(/\./g, '·'), // sanitize key
                    sanitizeKeys(rest),
                ])
            );
        } else {
            return obj.map(sanitizeKeys);
        }
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key.replace(/\./g, '·'),
                sanitizeKeys(value),
            ])
        );
    }
    return obj;
}

async function storeAttendance(attendanceData) {
    // console.log("store attendance", attendanceData);
    for (const entry of attendanceData) {
        const sanitizedSchools = sanitizeKeys(entry.schools);

        await Attendance.findOneAndUpdate(
            { date: entry.date },
            { $set: { schools: sanitizedSchools } },
            { upsert: true, new: true }
        );
    }
}
