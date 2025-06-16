'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useParams } from "next/navigation";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import ReusableTable from '@/app/components/shared/ReusableTable';
import ProgramGraph from '@/app/components/shared/ProgramGraph';
import DateRangePicker from '@/app/components/shared/DateRangePicker';

const getSessiondate = () => {
  if (typeof window !== 'undefined') {
    const storedDate = sessionStorage.getItem('initialDate');
    return storedDate ? new Date(storedDate) : null;
  }
  return null;
};

export default function AttendancePage() {
  const params = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
   const [rangeData, setRangeData] = useState([]);
  const [loading, setLoading] = useState(false);
   const [loadingGraph, setLoadingGraph] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    return getSessiondate() || new Date(new Date().setDate(new Date().getDate() - 1));
  });

  const school = params.program;
  const formattedSchoolName = school ? decodeURIComponent(school).replace(/-/g, " ") : '';

  const handleDateRangeChange = (type, date) => {
    console.log(type,date,'cvxghxgjgd')
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
      fetchRangeAttendance(startDate, date, formattedSchoolName);
    }
  };
  const fetchAttendance = async (date, formattedSchoolName) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/program-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'single',
          date: format(date, 'dd-MMM-yyyy'),
          organisationId: '67f4172c7d0948b743254577',
          schoolName: formattedSchoolName,
        }),
      });

      const data = await response.json();
      setAttendanceData(response.ok ? data.res : []);
    } catch (error) {
      console.error('Fetch Error:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRangeAttendance = async (start, end, formattedSchoolName) => {
    setLoadingGraph(true);
    try {
      const response = await fetch(`http://localhost:3000/api/program-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'range',
          startDate: format(start, 'dd-MM-yyyy'),
          endDate: format(end, 'dd-MM-yyyy'),
          // date: format(date, 'dd-MMM-yyyy'),
          organisationId: '67f4172c7d0948b743254577',
          schoolName: formattedSchoolName,
        }),
      });

      const data = await response.json();
      setRangeData(response.ok ? data.res : []);
    } 
    catch (error) {
      console.error('Fetch Error:', error);
      setRangeData([]);
    } finally {
      setLoadingGraph(false);
    }
  };
  const handleChange = (date) => {
    console.log('date', date);
    sessionStorage.setItem('initialDate', date);
    setSelectedDate(date);
  }

  useEffect(() => {
    // fetchRangeAttendance(formattedSchoolName);
    fetchAttendance(selectedDate, formattedSchoolName);
  }, [selectedDate]);

  const tableHeaders = [
    { label: 'Program Name', key: 'name' },
    { label: 'Total Actual', key: 'total_actual' },
    { label: 'Total Present', key: 'total_present' },
    { label: 'Total Absent', key: 'total_absent' },
    { label: 'Attendance %', key: 'attendance_percentage' },
    { label: 'View', key: 'view' },
  ];

  // Add derived field
  const tableData = attendanceData.map(program => ({
    ...program,
    attendance_percentage: ((program.total_present / program.total_actual) * 100).toFixed(2) + '%',
    view: program.name,
  }));

  return (
    <div className='bg-white rounded-xl p-3 min-h-[280px]'>
      <div className='flex justify-between items-center pb-3'>
        <div className='text-lg font-bold'>Program's Attendance Summary</div>
        <DatePicker
          selected={selectedDate}
          // onChange={(date) => setSelectedDate(date)}
          onChange={(date) => handleChange(date)}
          dateFormat="dd/MM/yyyy"
          className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500"
          popperPlacement="bottom-end"
          maxDate={new Date()}
        />
      </div>

      {loading ? (
        <div className="p-4 text-lg">Loading...</div>
      ) : attendanceData.length > 0 ? (
        <>
          <ReusableTable
            title="Program Attendance Summary"
            headers={tableHeaders}
            data={tableData}
            height="240px"
          >
            <thead className="text-sm font-medium bg-[#EFEFF4] sticky top-[-1px] z-10">
              <tr className="text-left">
                {tableHeaders.map((header, i) => (
                  <th key={i} className="border border-gray-100 px-4 py-2">{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {attendanceData.map((program, index) => {
                const attendancePercentage = ((program.total_present / program.total_actual) * 100).toFixed(2);
                return (
                  <tr key={index} className="border border-gray-100 bg-white hover:bg-[#efeded]">
                    <td className="border border-gray-100 px-4 py-2 font-medium">{program.name}</td>
                    <td className="border border-gray-100 px-4 py-2 text-center">{program.total_actual}</td>
                    <td className="border border-gray-100 px-4 py-3 text-center">
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">{program.total_present}</span>
                    </td>
                    <td className="border border-gray-100 px-4 py-3 text-center">
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">{program.total_absent}</span>
                    </td>
                    <td className="border border-gray-100 px-4 py-3 text-center">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">{attendancePercentage}%</span>
                    </td>
                    <td className="border border-gray-100 px-4 py-2 font-bold text-center">
                      <Link href={`/management/school-attendance/${school}/${encodeURIComponent(program.name.replace(/\s+/g, "-"))}`}>
                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded-full text-xs font-medium transition cursor-pointer">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </ReusableTable>
        </>
      ) : (
        <p className="text-red-500">No data available. Please upload an attendance file.</p>
      )}
        {/* <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
          <div className="bg-white rounded-2xl shadow p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Attendance Overview</h2>
                <div className="text-sm text-gray-500"> <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                />
                </div></div>
                  {rangeData.length > 0 ? ( 
              <ProgramGraph data={rangeData} />
          ): ( <p className="text-red-500">No data available. Please upload an attendance file.</p>) }
            </div>
          </div>

        </div> */}
    
    </div >
  );
}
