"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
// import axios from "axios";

const getSessiondate = () => {
    if (typeof window !== "undefined" && sessionStorage.getItem('initialDate')) {
        return sessionStorage.getItem('initialDate');
    }
    return null;
};
export default function StaffProductivitySummary() {
    const params = useParams();
    // console.log('params', params);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState();
    // const [selectedDate, setSelectedDate] = useState("12-May-2025");
    const [selectedDate, setSelectedDate] = useState(() => {
        if (getSessiondate()) {
            return getSessiondate();
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday;
        }
    });
    const staffId = params.staff;
    const organisationId = "67f4172c7d0948b743254577";

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/staff-subject-summary`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: "single",
                        date: format(selectedDate, 'dd-MMM-yyyy'),
                        organisationId,
                        staffId: params.staff,
                    }),
                });

                const data = await res.json();
                // console.log(' first data', data.res);
                // setRangeData(response.ok ? data.res : []);
                // console.log('res data', res);
                // const data = res.data.res;
                setPrograms(data.res);
                setSelectedProgram(data.res[0]);
            }
            catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [selectedDate]);

    const calculateAttendance = (program) => {
        const total = program.actual || 0;
        const taken = program.present || 0;
        const percentage = total ? Math.round((taken / total) * 100) : 0;
        return {
            total,
            taken,
            notTaken: total - taken,
            percentage,
        };
    };

    return (
        <div className="p-2">
            <div className="max-w-6xl mx-auto">
                {/* Heading */}
                <h1 className="text-xl font-bold mb-4">Productivity Summary - {programs[0]?.staff_name || "Loading..."}</h1>

                {/* Main Container */}
                <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-4 p-6 max-h-none md:max-h-[65vh] overflow-hidden">
                    {/* Left Pane */}
                    <div className="w-full md:w-1/2 border border-gray-200 shadow-md rounded-xl p-6 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Program Information</h2>
                            <div className="relative">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => handleChange(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500 z-20"
                                    popperPlacement="bottom-end"
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-grow pr-2 overflow-hidden">
                            <ul className="space-y-3">
                                {programs.map((program, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{program.name}</span>
                                        <button
                                            onClick={() => setSelectedProgram(program)}
                                            className={`px-4 py-1 rounded-full text-sm ${selectedProgram?.name === program.name
                                                    ? "bg-purple-600 text-white"
                                                    : "border border-purple-600 text-purple-600"
                                                }`}
                                        >
                                            View
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Pane */}
                    <div className="w-full md:w-1/2 border border-gray-200 shadow-md rounded-xl p-6 flex flex-col justify-center overflow-y-auto overflow-hidden">
                        {selectedProgram ? (
                            <>
                                <div className="mb-4">
                                    <span className="text-lg font-semibold">{selectedProgram.programName} - </span>
                                    <span className="text-sm underline"> {selectedProgram.name}</span>
                                </div>

                                <div className="flex justify-center gap-4 md:gap-6 my-6 flex-wrap">
                                    {(() => {
                                        const { total, taken, notTaken, percentage } = calculateAttendance(selectedProgram);
                                        const boxItems = [
                                            {
                                                value: selectedProgram.actual,
                                                label: "Total Students",
                                                bg: "bg-purple-600",
                                            },
                                            {
                                                value: selectedProgram.present,
                                                label: "Present Students",
                                                bg: "bg-black",
                                            },
                                            {
                                                value: selectedProgram.absent,
                                                label: "Absent Students",
                                                bg: "bg-orange-400",
                                            },
                                        ];

                                        return boxItems.map((item, index) => (
                                            <div key={index} className="flex flex-col items-center text-center">
                                                <div
                                                    className={`w-24 h-16 rounded-lg flex items-center justify-center text-xl font-bold text-white ${item.bg}`}
                                                >
                                                    {item.value.toString().padStart(2, "0")}
                                                </div>
                                                <p className="text-sm mt-2">{item.label}</p>
                                            </div>
                                        ));
                                    })()}
                                </div>

                                <div>
                                    <p className="text-2xl font-bold">
                                        {calculateAttendance(selectedProgram).percentage}%
                                    </p>
                                    <p className="text-sm text-gray-500">% of Attendance</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Select a program to view data.</p>
                        )}
                    </div>
                </div>


            </div>

        </div>
    );
}
