import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import Semesters from "../../../../lib/models/Semesters";



export async function POST(req) {
  try {
    await connectToDatabase();

    const { type, date, startDate, endDate, organisationId, schoolName, programName } = await req.json();

    const query = {
      organisationId,
      schoolName,
      programName
    };

    if (type === "single" && date) {
      // Exact date match
      query.date = date;
      // console.log("query", query)
    } else if (type === "range" && startDate && endDate) {
      // Date range
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      return NextResponse.json({ error: "Invalid date parameters" }, { status: 400 });
    }

    const semesters = await Semesters.find(query).sort({ createdAt: -1 });

    if (semesters.length > 0) {
      return NextResponse.json({ message: "School data fetched successfully!", res: semesters });
    }

    return NextResponse.json({ message: "No data found", res: [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


  
