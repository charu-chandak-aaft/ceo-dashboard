import School from "../../../../lib/models/Schools";
import Program from "../../../../lib/models/Programs";
import Semester from "../../../../lib/models/Semesters";
import Subject from "../../../../lib/models/Subjects";
import Staff from "../../../../lib/models/Staff";
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    await Subject.deleteMany();
    await Semester.deleteMany();
    await School.deleteMany();
    await Staff.deleteMany();
    await Program.deleteMany();

    return NextResponse.json({msg: 'deleted successfully'});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organisations' }, { status: 500 });
  }
}