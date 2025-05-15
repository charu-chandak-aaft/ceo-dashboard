import Table from "@/app/components/attendance/Table";

const attendanceData = [
  { subject: "MSAV-1-1", staff: "ASM5598/ Harsh Kumar", total: 14, present: 2, absent: 12, percentage: 14 },
  { subject: "MSAV-1-2", staff: "ASM5598/ Harsh Kumar", total: 14, present: 6, absent: 8, percentage: 43 },
  { subject: "MSAV-1-3", staff: "ASM5598/ Harsh Kumar", total: 14, present: 2, absent: 12, percentage: 14 },
  { subject: "MSAV-1-4", staff: "ASM5598/ Harsh Kumar", total: 14, present: 6, absent: 8, percentage: 43 },
  { subject: "MSAV-1-5", staff: "ASM5598/ Harsh Kumar", total: 14, present: 5, absent: 9, percentage: 36 },
  { subject: "MSAV-1-6", staff: "ASM5598/ Harsh Kumar", total: 8, present: 2, absent: 6, percentage: 25 },
];

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Table>
        <thead className="bg-gray-100 text-gray-600 font-medium rounded">
          <tr>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Staff ID/ Staff Name</th>
            <th className="px-4 py-3">Total Actual</th>
            <th className="px-4 py-3">Present</th>
            <th className="px-4 py-3">Absent</th>
            <th className="px-4 py-3">Attendance%</th>
            <th className="px-4 py-3">View</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {attendanceData.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="px-4 py-3 font-medium">{row.subject}</td>
              <td className="px-4 py-3">{row.staff}</td>
              <td className="px-4 py-3 text-indigo-600 font-semibold">{row.total}</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {row.present}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                  {row.absent}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                  {row.percentage}%
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded-full text-xs font-medium transition">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
