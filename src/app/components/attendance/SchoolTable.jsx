import Link from "next/link";
import React from "react";

const SchoolTable = ({ schoolsData }) => {
  if (!schoolsData) return <p className="text-red-500">No data available.</p>;

  return (
    <div className="overflow-x-auto rounded-lg overflow-hidden border border-gray-800 shadow-md">
      <table className="min-w-full border-collapse border border-gray-800 shadow-md bg-gray-200 rounded-lg text-gray-900"
      >
        <thead>
          <tr className="bg-gray-300 text-left">
            <th className="border border-gray-300 px-4 py-2">School Name</th>
            <th className="border border-gray-300 px-4 py-2">Total Actual</th>
            <th className="border border-gray-300 px-4 py-2">Total Present</th>
            <th className="border border-gray-300 px-4 py-2">Total Absent</th>
            <th className="border border-gray-300 px-4 py-2">Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(schoolsData).map(([schoolName, school]) => {
            const attendancePercentage = ((school.total_present / school.total_actual) * 100).toFixed(2);
            return (
              <tr key={schoolName} className="border border-gray-300 hover:bg-gray-100"  onClick={() => window.location.href = `school-attendance/${encodeURIComponent(schoolName.replace(/\s+/g, "-"))}`}>
                <td className="border border-gray-300 px-4 py-2 font-semibold"> <Link href={`school-attendance/${encodeURIComponent(schoolName.replace(/\s+/g, "-"))}`}>{schoolName}</Link></td>
                <td className="border border-gray-300 px-4 py-2">{school.total_actual}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">{school.total_present}</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">{school.total_absent}</td>
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {attendancePercentage}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolTable;
