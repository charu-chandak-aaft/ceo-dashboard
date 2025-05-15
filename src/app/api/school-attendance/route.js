import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import School from "../../../../lib/models/Schools";



export async function POST(req) {
  try {
    await connectToDatabase();   
    const { date, organisationId } = await req.json();
    const schools = await School.find({date, organisationId}).sort({ createdAt: -1 });

    if(schools){
        return NextResponse.json({ message: "School data get successfully!", res:schools });
    }

    return NextResponse.json({ message: "No data found", res:[] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


  
