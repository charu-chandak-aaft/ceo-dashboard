import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../lib/mongoose";
import StaffAttendance from "../../../../lib/models/StaffAttendance";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { type, date, startDate, endDate, organisationId } = await req.json();

    if (!organisationId) {
      return NextResponse.json({ error: "organisationId is required" }, { status: 400 });
    }

    const matchStage = {
      organisationId: new mongoose.Types.ObjectId(organisationId),
    };

    if (type === "single" && date) {
      matchStage.date = date;
    } else if (type === "range" && startDate && endDate) {
      matchStage.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      return NextResponse.json({ error: "Invalid date parameters" }, { status: 400 });
    }

    console.log("MatchStage:", matchStage);

    const staffProductivity = await StaffAttendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$staff_id",
          staff_name: { $first: "$staff_name" },
          totalLectures: { $sum: 1 }, // Count each entry for total scheduled lectures
          totalPresent: { $sum: "$present" },
          totalAbsent: { $sum: "$absent" },
          classTaken: {
            $sum: { $cond: [{ $eq: ["$attendance_status", true] }, 1, 0] }
          },
          classNotTaken: {
            $sum: { $cond: [{ $eq: ["$attendance_status", false] }, 1, 0] }
          },
          subjects: { $addToSet: "$subjectName" }
        }
      },
      {
        $project: {
          _id: 0,
          staff_id: "$_id",
          staff_name: 1,
          totalLectures: 1,
          totalPresent: 1,
          totalAbsent: 1,
          classTaken: 1,
          classNotTaken: 1,
          subjects: 1
        }
      },
      { $sort: { staff_name: 1 } }
    ]);

    return NextResponse.json({
      message: staffProductivity.length ? "Staff productivity data fetched successfully!" : "No data found",
      res: staffProductivity
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
