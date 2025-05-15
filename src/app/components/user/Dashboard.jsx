'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaChartPie, FaUser, FaCog, FaBell } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

const Dashboard = () => {
    return (
        <div className="w-full min-h-screen bg-[#0B1320] text-white flex">
            {/* Sidebar */}
            <aside className="hidden lg:block w-50 bg-[#0E1628] p-6">
                <h1 className="text-2xl font-bold mb-10 text-red-500">AAFT CONNECT</h1>
                <nav>
                    <ul className="space-y-4">
                        <li className="bg-red-500 p-3 rounded-lg cursor-pointer">Dashboard</li>
                        <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">Analytics</li>
                        <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">Sales</li>
                        <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">Reports <span className="ml-2 bg-gray-600 px-2 py-1 rounded-full text-xs">17</span></li>
                    </ul>
                </nav>
                <div className="mt-10">
                    <h3 className="text-gray-400 uppercase text-sm mb-3">Notifications</h3>
                    <ul className="space-y-4">
                        <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">Profile</li>
                        <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">Settings</li>
                    </ul>
                </div>
                <div className="mt-10 text-gray-500 text-xs">© 2024 AAFT <br /> Powered by AAFT</div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-3 container mx-3">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl">CEO Dashboard Overview</h2>
                    <input type="text" placeholder="Search..." className="bg-gray-700 text-white p-2 rounded-md w-64" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ gridTemplateColumns: "70% 30%" }}>
                    <div className="grid grid-col-2 lg:grid-cols-3 gap-2">
                        {["Leadsquared", "Camu", "Salesken", "LMS", "Superset", "Almashine", "CRC", "Marketing Anly.", "Sales Analytics"].map((title, index) => (
                            <div key={index} className="bg-gray-800 p-6 rounded-lg text-center relative flex items-center justify-center flex-col mt-10">
                                <div className="absolute -top-8 bg-white p-2 rounded-lg shadow-md">
                                    <img src="/leadsquared-logo.png" alt={`${title} Logo`} className="w-12 h-12" />
                                </div>
                                <div className="text-center mt-8">
                                    <h3 className="text-white text-lg font-bold">{title}</h3>
                                    <p className="text-gray-400 text-sm">Click and Login</p>
                                </div>
                                <div className="absolute bottom-[-1px] right-[-1px] cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 36 36">
                                        <g id="Group_30" data-name="Group 30" transform="translate(-627.614 -560.614)">
                                            <circle id="Ellipse_3" data-name="Ellipse 3" cx="18" cy="18" r="18" transform="translate(627.614 560.614)" fill="#0b9afc" opacity="0.26" />
                                            <path id="arrow" d="M.38,12.715a1.317,1.317,0,0,1,0-1.852L8.554,2.62H3.9A1.31,1.31,0,0,1,3.9,0h7.793a1.281,1.281,0,0,1,.629.164l.008,0,.016.009.016.01.008,0,.022.014h0a1.312,1.312,0,0,1,.572.839v0l.005.029v0l0,.026v.007l0,.024v.008l0,.023v.01c0,.008,0,.016,0,.024v.008c0,.009,0,.017,0,.026v.007c0,.01,0,.019,0,.029s0,0,0,0,0,.022,0,.033h0V9.17a1.3,1.3,0,1,1-2.6,0v-4.7L2.217,12.715a1.292,1.292,0,0,1-1.836,0Z" transform="translate(639.611 571.413)" fill="#0b9afc" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="p-6 text-center relative flex items-center justify-center flex-col">
                        <div className="bg-red-500 p-6 rounded-lg text-center">
                            <h3 className="text-lg">Marketing goal for the past year</h3>
                            <p className="text-4xl font-bold">$4,520.00</p>
                            <p className="text-sm">You reached 68% of your goal</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg text-center relative flex items-center justify-center flex-col mt-12">
                            {/* <div className="flex justify-center"> */}
                            <div className="absolute -top-8 p-2 rounded-lg shadow-md mb-4">
                                <img src="/profile.jpg" className="w-20 h-20 rounded-full border-4 border-green-400" alt="Profile" />
                            </div>
                            <div className="text-center mt-10">
                                <h3 className="text-xl font-bold">Akshay Marwah</h3>
                                <p className="text-blue-400">CEO</p>
                                <p className="text-gray-400 text-sm">akshaymarwah@email.com</p>
                                <p className="text-gray-400 text-sm">+01 923 456 78</p>
                                <p className="text-gray-400 text-sm">16/A Marwah Studio</p>
                                <div className="flex justify-center items-center space-x-2 mt-3">
                                    <img src="/contact1.jpg" className="w-8 h-8 rounded-full" alt="Contact 1" />
                                    <img src="/contact2.jpg" className="w-8 h-8 rounded-full" alt="Contact 2" />
                                    <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">+29</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
