import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import Programs from "../../../../lib/models/Programs";



export async function POST(req) {
  try {
    await connectToDatabase();

    const { type, date, startDate, endDate, organisationId, schoolName } = await req.json();

    const query = {
      organisationId,
      schoolName,
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

    const programs = await Programs.find(query).sort({ createdAt: -1 });

    if (programs.length > 0) {
      return NextResponse.json({ message: "School data fetched successfully!", res: programs });
    }

    return NextResponse.json({ message: "No data found", res: [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


  
