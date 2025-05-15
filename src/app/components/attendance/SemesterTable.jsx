import Link from "next/link";
import React from "react";

const SemesterTable = ({ schoolName, semesterData, programName }) => {
    if (!semesterData || Object.keys(semesterData).length === 0) {
        return <p className="text-red-500">No data available.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg overflow-hidden border border-gray-200 shadow-md">
            <table className="min-w-full border-collapse border border-gray-200 shadow-lg rounded-md text-gray-900">
                <thead className="font-medium">
                    <tr className="bg-[#EFEFF4] text-left">
                        <th className="border border-gray-100 px-4 py-2 text-center align-middle">Program Name</th>
                        <th className="border border-gray-100 px-4 py-2 text-center align-middle">Total Actual</th>
                        <th className="border border-gray-100 px-4 py-2 text-center align-middle">Total Present</th>
                        <th className="border border-gray-100 px-4 py-2 text-center align-middle">Total Absent</th>
                        <th className="border border-gray-100 px-4 py-2 text-center align-middle">Attendance %</th>
                        <th className="border border-gray-100 px-4 py-2 text-center align-middle">View</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(semesterData).map(([semesterName, program]) => {
                        if (!program) return null; // Ensure program exists before accessing properties

                        const attendancePercentage = ((program.total_present / program.total_actual) * 100).toFixed(2);

                        return (
                            <tr
                                key={semesterName}
                                className="border border-gray-100 bg-white hover:bg-[#efeded]"
                                onClick={() =>
                                    window.location.href = `/admin/school-attendance/${encodeURIComponent(schoolName.replace(/\s+/g, "-"))}/${encodeURIComponent(programName.replace(/\s+/g, "-"))}/${encodeURIComponent(semesterName.replace(/\s+/g, "-"))}`
                                }
                            >
                                <td className="border border-gray-100 px-4 py-2 font-medium text-center align-middle">
                                    <Link
                                        href={`/admin/school-attendance/${encodeURIComponent(schoolName.replace(/\s+/g, "-"))}/${encodeURIComponent(programName.replace(/\s+/g, "-"))}/${encodeURIComponent(semesterName.replace(/\s+/g, "-"))}`}
                                    >
                                        {semesterName}
                                    </Link>
                                </td>
                                <td className="border border-gray-100 px-4 py-2 text-center align-middle">{program.total_actual}</td>
                                {/* <td className="border border-gray-100 px-4 py-2 text-green-600">{program.total_present}</td> */}
                                {/* <td className="border border-gray-100 px-4 py-2 text-red-600">{program.total_absent}</td> */}
                                <td className="border border-gray-100 px-4 py-3 text-center align-middle">
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                                        {program.total_present}
                                    </span>
                                </td>
                                <td className="border border-gray-100 px-4 py-3 text-center align-middle">
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                                        {program.total_absent}
                                    </span>
                                </td>

                                <td className="border border-gray-100 px-4 py-3 text-center align-middle">
                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                                        {attendancePercentage}%
                                    </span>
                                </td>
                                <td className="border border-gray-100 px-4 py-2 font-bold text-center align-middle">
                                    <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded-full text-xs font-medium transition">
                                        View
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SemesterTable;
