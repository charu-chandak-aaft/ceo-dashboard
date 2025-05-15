import Link from "next/link";
import React from "react";

const ProgramTable = ({ schoolName, programsData }) => {
  if (!programsData || Object.keys(programsData).length === 0) {
    return <p className="text-red-500">No data available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg overflow-hidden border border-gray-800 shadow-md">
      <table className="min-w-full border-collapse border border-gray-800 shadow-md bg-gray-200 rounded-lg text-gray-900">
        <thead>
          <tr className="bg-gray-300 text-left">
            <th className="border border-gray-300 px-4 py-2">Program Name</th>
            <th className="border border-gray-300 px-4 py-2">Total Actual</th>
            <th className="border border-gray-300 px-4 py-2">Total Present</th>
            <th className="border border-gray-300 px-4 py-2">Total Absent</th>
            <th className="border border-gray-300 px-4 py-2">Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(programsData).map(([programName, program]) => {
            if (!program) return null; // Ensure program exists before accessing properties

            const attendancePercentage = ((program.total_present / program.total_actual) * 100).toFixed(2);

            return (
              <tr
                key={programName}
                className="border border-gray-300 hover:bg-gray-100"
                onClick={() =>
                  window.location.href = `/admin/school-attendance/${encodeURIComponent(schoolName.replace(/\s+/g, "-"))}/${encodeURIComponent(programName.replace(/\s+/g, "-"))}`
                }
              >
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  <Link
                    href={`/admin/school-attendance/${encodeURIComponent(schoolName.replace(/\s+/g, "-"))}/${encodeURIComponent(programName.replace(/\s+/g, "-"))}`}
                  >
                    {programName}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">{program.total_actual}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">{program.total_present}</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">{program.total_absent}</td>
                <td className="border border-gray-300 px-4 py-2 font-bold">{attendancePercentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramTable;
