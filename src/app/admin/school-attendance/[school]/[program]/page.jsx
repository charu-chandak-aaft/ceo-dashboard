"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Use useParams() instead of accessing params directly
import { useAttendance } from "@/context/AttendanceContext";
import SemesterTable from "@/app/components/attendance/SemesterTable";

export default function SchoolAttendancePage() {
  const params = useParams(); // ✅ Correct way to get params in Next.js 14+
  const { attendanceData, setAttendanceData } = useAttendance();
  const [loading, setLoading] = useState(!attendanceData);

  // ✅ Ensure params are resolved before accessing school
  const school = params?.school;
  const program = params?.program;
  console.log("program name", program)
  if (!school) return <p className="text-red-500">Invalid school name.</p>;

  // ✅ Fix: Ensure school name is safely formatted
  const formattedSchoolName = decodeURIComponent(school).replace(/-/g, " ");
  const formattedProgramName = decodeURIComponent(program).replace(/-/g, " ");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/attendance");
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        setAttendanceData(json);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!attendanceData) {
      fetchData();
    }
  }, [attendanceData, setAttendanceData]);

  // ✅ Fix: Check if schoolData exists before rendering
  const schoolData = attendanceData?.data?.schools?.[formattedSchoolName];
  const programData = schoolData?.programs?.[formattedProgramName];

  console.log("schoolData", schoolData);
  console.log("programData",programData );
  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-black">{formattedSchoolName} Attendance Summary - {formattedProgramName}</h1>

      {loading ? (
        <p className="text-blue-500">Loading data...</p>
      ) : programData ? (
        <SemesterTable schoolName={formattedSchoolName} semesterData={programData.semesters} programName={formattedProgramName} />
      ) : (
        <p className="text-red-500">No data available for {formattedSchoolName}.</p>
      )}
    </div>
  );
}
