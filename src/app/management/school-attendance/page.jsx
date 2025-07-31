'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import ReusableTable from '@/app/components/shared/ReusableTable';
import withAuth from '../../../../lib/withAuth';

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });

  // ✅ Only for page load fallback logic
  const fetchAttendanceWithFallback = async (initialDate) => {
    setLoading(true);
    let currentDate = new Date(initialDate);
    const maxDaysBack = 15;
    let tries = 0;

    while (tries < maxDaysBack) {
      try {
        const response = await fetch(`/api/school-attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: format(currentDate, 'dd-MMM-yyyy'),
            organisationId: '67f4172c7d0948b743254577',
          }),
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data.res) && data.res.length > 0) {
          setAttendanceData(data.res);
          setSelectedDate(new Date(currentDate)); // ✅ Update date shown in calendar
          sessionStorage.setItem('initialDate', currentDate);
          break;
        } else {
          currentDate.setDate(currentDate.getDate() - 1);
          tries++;
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setAttendanceData([]);
        break;
      }
    }

    if (tries === maxDaysBack) {
      setAttendanceData([]);
    }

    setLoading(false);
  };

  // ✅ For calendar-selected date only (no fallback)
  const fetchAttendanceForExactDate = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/school-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(date, 'dd-MMM-yyyy'),
          organisationId: '67f4172c7d0948b743254577',
        }),
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data.res) && data.res.length > 0) {
        setAttendanceData(data.res);
      } else {
        setAttendanceData([]); // ❌ No fallback here
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // 📅 When user selects a date manually
  const handleChange = (date) => {
    setSelectedDate(date);
    sessionStorage.setItem('initialDate', date);
    fetchAttendanceForExactDate(date); // ⬅️ Only fetch this exact date
  };

  const tableHeaders = [
    { label: 'School Name', key: 'name' },
    { label: 'Total Actual', key: 'total_actual' },
    { label: 'Total Present', key: 'total_present' },
    { label: 'Total Absent', key: 'total_absent' },
    { label: 'Attendance %', key: 'attendance_percentage' },
    { label: 'View', key: 'view' },
  ];

  // 🚀 On first mount only (initial fallback)
  useEffect(() => {
    fetchAttendanceWithFallback(selectedDate);
  }, []);

  return (
    <div className='bg-white rounded-xl p-5'>
      <div className='flex justify-between items-center'>
        <div className='text-lg font-bold text-black'>School Attendance Summary</div>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleChange(date)}
            dateFormat="dd/MM/yyyy"
            className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500 z-20"
            popperPlacement="bottom-end"
            maxDate={new Date()} // Disable future dates
          />
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-lg">Loading...</div>
      ) : attendanceData?.length > 0 ? (

        <ReusableTable
          title="Program Attendance Summary"
          headers={tableHeaders}
          data={attendanceData}
          height="65vh"
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
              let attendancePercentage = ((program.total_present / program.total_actual) * 100).toFixed(2);
              attendancePercentage = isNaN(attendancePercentage) ? 0 : attendancePercentage;
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
                    <Link href={`/management/school-attendance/${encodeURIComponent(program.name.replace(/\s+/g, "-"))}`}>
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
      ) : (
        <p className="text-red-500">No data available. Please upload an attendance file.</p>
      )}
    </div>
  );
}

export default withAuth(AttendancePage);
