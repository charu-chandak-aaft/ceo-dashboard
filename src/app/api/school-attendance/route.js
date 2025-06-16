import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import School from "../../../../lib/models/Schools";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { date, startDate, endDate, organisationId } = await req.json();

    let query = { organisationId };

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const schools = await School.find(query).sort({ createdAt: -1 });

    if (schools && schools.length > 0) {
      return NextResponse.json({
        message: "School data fetched successfully!",
        res: schools,
      });
    }

    return NextResponse.json({ message: "No data found", res: [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
