import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import Subjects from "../../../../lib/models/Subjects";



export async function POST(req) {
  try {
    await connectToDatabase();

    const { type, date, startDate, endDate, organisationId, schoolName, programName, semesterName } = await req.json();

    const query = {
      organisationId,
      schoolName,
      programName,
      semesterName
    };

    if (type === "single" && date) {
      // Exact date match
      query.date = date;
      console.log("query", query)
    } else if (type === "range" && startDate && endDate) {
      // Date range
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      return NextResponse.json({ error: "Invalid date parameters" }, { status: 400 });
    }

    const Subject = await Subjects.find(query).sort({ createdAt: -1 });

    if (Subject.length > 0) {
      return NextResponse.json({ message: "School data fetched successfully!", res: Subject });
    }

    return NextResponse.json({ message: "No data found", res: [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


  
