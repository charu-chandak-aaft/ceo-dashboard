"use client";
import { useEffect } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import SchoolTable from "@/app/components/attendance/SchoolTable";

export default function SchoolsPage() {
  // const { attendanceData } = useAttendance();
  const { attendanceData, setAttendanceData } = useAttendance();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/attendance");
        const json = await response.json();

        setAttendanceData(json);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    }

    if (!attendanceData) {
      fetchData();
    }
  }, [attendanceData, setAttendanceData]);
  console.log("schoolPage data", attendanceData);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">School Attendance Summary</h1>
      {attendanceData ? (
        <SchoolTable schoolsData={attendanceData.data.schools} />
      ) : (
        <p className="text-red-500">No data available. Please upload an attendance file.</p>
      )}
    </div>
  );
}
