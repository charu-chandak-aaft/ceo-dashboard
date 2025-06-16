import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import Subjects from "../../../../lib/models/Subjects";

export async function POST(req) {
  try {
    await connectToDatabase();

    // Safely read the request body
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { type, date, startDate, endDate, organisationId, staffId } = body;

    if (
      !type ||
      !organisationId ||
      !staffId ||
      (type === "single" && !date) ||
      (type === "range" && (!startDate || !endDate))
    ) {
      return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
    }

    const query = {
      organisationId,
      staff_id: staffId,
    };

    if (type === "single") {
      query.date = date; // string date matching DB
    } else {
      query.date = { $gte: startDate, $lte: endDate }; // string date range
    }

    const subjects = await Subjects.find(query).sort({ createdAt: -1 });

    // Deduplicate based on `programName`
    const uniqueProgramsMap = new Map();
    subjects.forEach(item => {
      if (!uniqueProgramsMap.has(item.programName)) {
        uniqueProgramsMap.set(item.programName, item);
      }
    });

    const uniqueSubjects = Array.from(uniqueProgramsMap.values());

    return NextResponse.json({
      message: uniqueSubjects.length ? "Unique program data fetched successfully!" : "No data found",
      res: uniqueSubjects,
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
