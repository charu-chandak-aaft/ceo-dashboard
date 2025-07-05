import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// const data = [
//   { date: "01 Apr", present: 70, absent: 30 },
//   { date: "02 Apr", present: 100, absent: 0 },
//   { date: "03 Apr", present: 50, absent: 50 },
//   { date: "04 Apr", present: 90, absent: 10 },
//   { date: "05 Apr", present: 70, absent: 30 },
//   { date: "06 Apr", present: 45, absent: 55 },
//   { date: "07 Apr", present: 68, absent: 32 },
//   { date: "08 Apr", present: 65, absent: 35 },
//   { date: "09 Apr", present: 75, absent: 25 },
//   { date: "01 Apr", present: 70, absent: 30 },
//   { date: "02 Apr", present: 100, absent: 0 },
//   { date: "03 Apr", present: 50, absent: 50 },
//   { date: "04 Apr", present: 90, absent: 10 },
//   { date: "05 Apr", present: 70, absent: 30 },
//   { date: "06 Apr", present: 45, absent: 55 },
//   { date: "07 Apr", present: 68, absent: 32 },
//   { date: "08 Apr", present: 65, absent: 35 },
//   { date: "09 Apr", present: 75, absent: 25 },
// ];
//      const total= 14;
//      const present = 2;
//       const absent= 12;
//       const percentage= Math.floor((present / (data.length * 100)) * 100);
      const SCROLLABLE_BAR_WIDTH = 68;

export default function ProgramGraph({data})
 {
    // console.log(data, 'graph');
     const chartWidth = data.length * SCROLLABLE_BAR_WIDTH;
  return (
    // <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
    //   <div className="bg-white rounded-2xl shadow p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    //     <div className="md:col-span-2">
    //       <div className="flex justify-between items-center mb-4">
    //         <h2 className="text-lg font-semibold">Attendance Overview</h2>
    //         <div className="text-sm text-gray-500">03/02/2025 - 03/04/2025</div>
    //       </div>
    <div className="flex justify-between items-center mb-4">
  <div className="w-full bg-white p-4 rounded-xl shadow-md">
    {/* Static wrapper (doesn't scroll) */}
    <div className="relative w-full h-[300px]">
      {/* Scrollable chart only */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-x-auto">
        <div style={{ width: chartWidth, height: '100%' }}>
          <BarChart width={chartWidth} height={300} data={data} barSize={24}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              minTickGap={20}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              domain={[0, 'auto']} 
            />
            <Tooltip />
            <Bar 
              dataKey="total_present" 
              fill="#8B5CF6" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="total_absent" 
              fill="#D1D5DB" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </div>
      </div>
    </div>
  </div>
</div>


    //    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 w-full">
    //   <div>
    //     <h3 className="font-semibold text-lg">Summary</h3>
    //     <p className="text-sm text-gray-500">School of Animation</p>
    //   </div>
    //   <div className="flex gap-2 text-white">
    //     <div className="bg-violet-500 rounded-xl px-4 py-2 text-center w-1/3">
    //       <p className="text-lg font-bold">{total}</p>
    //       <p className="text-xs">Total Student</p>
    //     </div>
    //     <div className="bg-black rounded-xl px-4 py-2 text-center w-1/3">
    //       <p className="text-lg font-bold">{present}</p>
    //       <p className="text-xs">Present</p>
    //     </div>
    //     <div className="bg-yellow-500 rounded-xl px-4 py-2 text-center w-1/3">
    //       <p className="text-lg font-bold">{absent}</p>
    //       <p className="text-xs">Absent</p>
    //     </div>
    //   </div>
    //   <div>
    //     <p className="text-2xl font-bold">{percentage}%</p>
    //     <p className="text-xs text-gray-500">% of Attendance</p>
    //   </div>
    // </div>
    //   </div>
    // </div>
  );
}
