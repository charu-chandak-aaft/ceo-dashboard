import School from "../../../../lib/models/Schools";
import Program from "../../../../lib/models/Programs";
import Semester from "../../../../lib/models/Semesters";
import Subject from "../../../../lib/models/Subjects";
import Staff from "../../../../lib/models/Staff";
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // e.g. "12-Aug-2025"

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    await connectToDatabase();

    const [subjectRes, semesterRes, schoolRes, staffRes, programRes] = await Promise.all([
      Subject.deleteMany({ date }),
      Semester.deleteMany({ date }),
      School.deleteMany({ date }),
      Staff.deleteMany({ date }),
      Program.deleteMany({ date }),
    ]);

    return NextResponse.json({
      msg: `Deleted records for date ${date}`,
      summary: {
        subjects: subjectRes.deletedCount,
        semesters: semesterRes.deletedCount,
        schools: schoolRes.deletedCount,
        staff: staffRes.deletedCount,
        programs: programRes.deletedCount,
      },
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
