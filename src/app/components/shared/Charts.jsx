'use client'
import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

function transformData(rawData) {
    return rawData
        .filter(item => item?.name && item?.total_present != null && item?.total_actual)
        .map(item => {
            const presentPercent = Math.round((item.total_present / item.total_actual) * 100)
            const absentPercent = 100 - presentPercent
            return {
                program: item.name,
                Present: presentPercent,
                Absent: absentPercent
            }
        })
}

export default function ChartComponent({ data }) {
    const chartData = transformData(data)

    return (
        <div className="w-full h-96 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-base">Attendance Comparison Chart</h2>
                <div className="space-x-2">
                    <button className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">28-Apr-2025</button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 80 }}
                    barGap={10}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="program" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 10 }} height={60} />
                    <YAxis
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="Present" fill="#8b5cf6" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="Absent" fill="#d1d5db" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
