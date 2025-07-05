'use client'
import React from 'react';
import ChartComponent from '@/app/components/shared/Charts';
import DatePicker from 'react-datepicker';
import DateRangePicker from '@/app/components/shared/DateRangePicker';

export default function SchoolAttendancePage() {
    // The updated data object with message and res array
    const data = {
        "message": "School data fetched successfully!",
        "res": [
            {
                "_id": "683549ca1846b7dbc2dc7e7f",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "Diploma in Advertising and Brand Communication",
                "total_actual": 30,
                "total_present": 20,
                "total_absent": 10,
                "createdAt": "2025-05-27T05:12:42.361Z",
                "updatedAt": "2025-05-27T05:12:42.361Z",
                "__v": 0
            },
            {
                "_id": "683549ca1846b7dbc2dc7e7f",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "Diploma in Advertising and Brand Communication",
                "total_actual": 30,
                "total_present": 20,
                "total_absent": 10,
                "createdAt": "2025-05-27T05:12:42.361Z",
                "updatedAt": "2025-05-27T05:12:42.361Z",
                "__v": 0
            },
            {
                "_id": "683549ca1846b7dbc2dc7e7d",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "Diploma in Public Relation and Events",
                "total_actual": 52,
                "total_present": 36,
                "total_absent": 16,
                "createdAt": "2025-05-27T05:12:42.326Z",
                "updatedAt": "2025-05-27T05:12:42.326Z",
                "__v": 0
            },
            {
                "_id": "683549ca1846b7dbc2dc7e77",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "Diploma in Event Management",
                "total_actual": 116,
                "total_present": 67,
                "total_absent": 49,
                "createdAt": "2025-05-27T05:12:42.226Z",
                "updatedAt": "2025-05-27T05:12:42.226Z",
                "__v": 0
            },
            {
                "_id": "683549ca1846b7dbc2dc7e6b",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "M A in Advertising and Brand Communication",
                "total_actual": 28,
                "total_present": 24,
                "total_absent": 4,
                "createdAt": "2025-05-27T05:12:42.001Z",
                "updatedAt": "2025-05-27T05:12:42.001Z",
                "__v": 0
            },
            {
                "_id": "683549c91846b7dbc2dc7e5f",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "M A in PR and Events",
                "total_actual": 96,
                "total_present": 47,
                "total_absent": 49,
                "createdAt": "2025-05-27T05:12:41.792Z",
                "updatedAt": "2025-05-27T05:12:41.792Z",
                "__v": 0
            },
            {
                "_id": "683549c91846b7dbc2dc7e5d",
                "organisationId": "67f4172c7d0948b743254577",
                "schoolName": "School of Advertising, PR and Events",
                "date": "28-Apr-2025",
                "name": "B A in Event Management",
                "total_actual": 288,
                "total_present": 130,
                "total_absent": 158,
                "createdAt": "2025-05-27T05:12:41.762Z",
                "updatedAt": "2025-05-27T05:12:41.762Z",
                "__v": 0
            }
            // ...rest of items
        ]
    };

    // Extract the attendance records array
    const records = data.res || [];

    // Calculate totals
    const totalActual = records.reduce((acc, item) => acc + item.total_actual, 0);
    const totalPresent = records.reduce((acc, item) => acc + item.total_present, 0);
    const totalAbsent = records.reduce((acc, item) => acc + item.total_absent, 0);

    // Calculate attendance percentage safely
    let attendancePercent = totalActual > 0 ? Math.round((totalPresent / totalActual) * 100) : 0;
    attendancePercent = isNaN(attendancePercent)? 0 : attendancePercent;
    // Extract school name from first record if exists
    const schoolName = records.length > 0 ? records[0].schoolName : '';

    return (
        <div className="p-5 rounded-xl shadow-sm w-full">
            <h2 className="font-semibold text-lg mb-4">
                School <span className="font-bold">Attendance Summary</span>
            </h2>
            <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-4 p-6 max-h-none md:max-h-[65vh] overflow-hidden">
                {/* Left Pane */}
                <div className="w-full md:w-1/2 border border-gray-200 shadow-md rounded-xl p-6 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Program Information</h2>
                        <div className="relative">
                            {/* <DateRangePicker
                                selected={selectedDate}
                                onChange={(date) => handleChange(date)}
                                dateFormat="dd/MM/yyyy"
                                className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500 z-20"
                                popperPlacement="bottom-end"
                                maxDate={new Date()}
                            /> */}
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2 overflow-hidden">
                        {/* Legend */}
                        <div className="flex gap-4 text-sm mb-2">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-violet-500 rounded-full inline-block" />
                                Present
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />
                                Absent
                            </div>
                        </div>

                        {/* Chart component */}
                        <div className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 my-4">
                            <ChartComponent data={records} />
                        </div>
                    </div>
                </div>

                {/* Right Pane */}
                <div className="w-full md:w-1/2 border border-gray-200 shadow-md rounded-xl p-6 flex flex-col justify-center overflow-y-auto overflow-hidden">
                    <h3 className="font-semibold text-lg">{schoolName}</h3>
                    {/* You might want to replace or remove this static text */}
                    <p className="text-sm text-gray-600">M.Sc in Animation</p>

                    <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            Semester-1
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            MSAV-1-1
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-4">
                        <div className="bg-violet-600 text-white text-center py-4 rounded-xl">
                            <p className="text-xl font-bold">{totalActual}</p>
                            <p className="text-xs">Total Student</p>
                        </div>
                        <div className="bg-black text-white text-center py-4 rounded-xl">
                            <p className="text-xl font-bold">{totalPresent}</p>
                            <p className="text-xs">Present</p>
                        </div>
                        <div className="bg-orange-400 text-white text-center py-4 rounded-xl">
                            <p className="text-xl font-bold">{totalAbsent}</p>
                            <p className="text-xs">Absent</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-2xl font-bold">{attendancePercent}%</p>
                        <p className="text-xs text-gray-500">Increased by Last Month</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
