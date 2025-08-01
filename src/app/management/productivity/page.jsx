'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import ReusableTable from '@/app/components/shared/ReusableTable';
import withAuth from '../../../../lib/withAuth';

const getSessiondate = () => {
  if (typeof window !== "undefined" && sessionStorage.getItem('initialDate')) {
    return new Date(sessionStorage.getItem('initialDate'));
  }
  return null;
};

function FacultyProductivityPage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [fullAttendanceData, setFullAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = getSessiondate();
    if (saved) return saved;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff-productivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
          date: format(date, 'dd-MMM-yyyy'),
          organisationId: '67f4172c7d0948b743254577',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFullAttendanceData(data.res);
        setAttendanceData(data.res); // Initial display
      } else {
        console.error('Error:', data.message);
        setFullAttendanceData([]);
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setFullAttendanceData([]);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (date) => {
    sessionStorage.setItem('initialDate', date);
    setSelectedDate(date);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = fullAttendanceData.filter(item =>
      item.staff_name?.toLowerCase().includes(value)
    );
    setAttendanceData(filtered);
  };

  const tableHeaders = [
    { label: 'Faculty Id', key: 'staff_id' },
    { label: 'Faculty Name', key: 'staff_name' },
    { label: 'Total Class Schedule', key: 'totalLectures' },
    { label: 'Class Taken', key: 'classTaken' },
    { label: 'Productivity %', key: 'productivity_percentage' },
    { label: 'View', key: 'view' },
  ];
  
const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  return (
    <div className='bg-white rounded-xl p-5 overflow-x-auto max-w-full overflow-hidden '>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <div className='text-lg font-bold text-black'>Faculty Productivity Summary</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Faculty Name"
            className="px-4 py-1 text-sm rounded-full border border-gray-300 focus:ring-violet-500 text-black"
          />
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
            className="w-30 px-1 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500"
            popperPlacement="bottom-end"
            maxDate={yesterday} // Disable future dates
            filterDate={(date) => date < new Date()}
          />
        </div>
      </div>

      {/* Loading or Table */}
      {loading ? (
        <div className="p-4 text-lg">Loading...</div>
      ) : attendanceData?.length > 0 ? (
        <ReusableTable
          title="Program Attendance Summary"
          headers={tableHeaders}
          data={attendanceData}
          height="340px"
        >
          <thead className="text-sm font-medium bg-[#EFEFF4] sticky top-[-1px] z-10">
            <tr className="text-left">
              {tableHeaders.map((header, i) => (
                <th key={i} className="border border-gray-100 px-4 py-2">{header?.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {attendanceData.map((program, index) => {
              const productivity_percentage = ((program.classTaken / program.totalLectures) * 100).toFixed(2);
              return (
                <tr key={index} className="border border-gray-100 bg-white hover:bg-[#efeded]">
                  <td className="border border-gray-100 px-4 py-2 font-medium">{program.staff_id}</td>
                  <td className="border border-gray-100 px-4 py-2 text-center">{program.staff_name}</td>
                  <td className="border border-gray-100 px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">{program.totalLectures}</span>
                  </td>
                  <td className="border border-gray-100 px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">{program.classTaken}</span>
                  </td>
                  <td className="border border-gray-100 px-4 py-3 text-center">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">{productivity_percentage}%</span>
                  </td>
                  <td className="border border-gray-100 px-4 py-2 font-bold text-center">
                    <Link href={`productivity/${encodeURIComponent(program.staff_id)}`}>
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

export default withAuth(FacultyProductivityPage);
