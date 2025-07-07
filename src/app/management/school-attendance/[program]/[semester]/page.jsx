'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useParams } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import ReusableTable from '@/app/components/shared/ReusableTable';
import withAuth from '../../../../../../lib/withAuth';

const getSessiondate = () => {
  if (typeof window !== "undefined" && sessionStorage.getItem('initialDate')) {
    return sessionStorage.getItem('initialDate');
  }
  return null;
};
function SemesterAttendancePage() {
  const params = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    if(getSessiondate()){
      return getSessiondate();
    }else{
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
    }
  }); 
  // console.log('sem console', params);
  const school = params.program;
  const semester = params.semester;
  const formattedProgramName = semester ? decodeURIComponent(semester).replace(/-/g, " ") : '';
  const formattedSchoolName = school ? decodeURIComponent(school).replace(/-/g, " ") : '';
  // console.log("school name", formattedProgramName)
  const fetchAttendance = async (date, formattedSchoolName , formattedProgramName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/semester-attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
          date: format(date, 'dd-MMM-yyyy'),
          organisationId: '67f4172c7d0948b743254577',
          schoolName: formattedSchoolName,
          programName: formattedProgramName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAttendanceData(data.res);
      } else {
        console.error('Error:', data.message);
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate, formattedSchoolName, formattedProgramName);
  }, [selectedDate]);

 const tableHeaders = [
    { label: 'Semester Name', key: 'name' },
    { label: 'Total Actual', key: 'total_actual' },
    { label: 'Total Present', key: 'total_present' },
    { label: 'Total Absent', key: 'total_absent' },
    { label: 'Attendance %', key: 'attendance_percentage' },
    { label: 'View', key: 'view' },
  ];
 const tableData = attendanceData.map(program => ({
    ...program,
    attendance_percentage: ((program.total_present / program.total_actual) * 100).toFixed(2) + '%',
    view: program.name,
  }));

  return (
    <div className='bg-white rounded-xl p-5'>
      <div className='flex justify-between items-center'>
        <div className='text-lg font-bold text-black'>Semester's Attendance Summary</div>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500"
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
          data={tableData}
          height="340px"
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
              attendancePercentage = isNaN(attendancePercentage)? 0 : attendancePercentage;
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
                    <Link href={`/management/school-attendance/${school}/${encodeURIComponent(semester?.replace(/\s+/g, "-"))}/${encodeURIComponent(program?.name?.replace(/\s+/g, "-"))}`}>
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
export default withAuth(SemesterAttendancePage);
