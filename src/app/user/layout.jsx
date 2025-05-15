// app/admin/layout.js

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function UserLayout({ children }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    };



    return (
        <div className="w-full h-screen flex overflow-hidden bg-[#0B1320] text-white">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-60' : 'w-16'
                    } bg-[#0E1628] text-white p-4 transition-all duration-300 ease-in-out flex flex-col justify-between h-screen sticky top-0`}
            >
                <div>
                    {sidebarOpen && (
                        <>
                            <div className="flex justify-center mb-10">
                                <Image
                                    src="/logos/aaft_connect_logo.png"
                                    alt="AAFT Logo"
                                    width={140}
                                    height={50}
                                    priority
                                    className="items-center"
                                />
                            </div>
                            <nav>
                                <ul className="space-y-3">
                                    <li className="bg-red-500 p-3 rounded-lg cursor-pointer">
                                        Dashboard
                                    </li>
                                </ul>
                            </nav>

                            <div className="mt-8">
                                <h3 className="text-gray-400 uppercase text-sm mb-2">
                                    Notifications
                                </h3>
                                <ul className="space-y-3">
                                    <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                                        Profile
                                    </li>
                                    <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                                        Settings
                                    </li>
                                    <li
                                        className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom section */}
                <div className="mt-4">
                    {sidebarOpen && (
                        <div className='mb-3'>
                           <span className="text-gray-300 text-xs font-semibold"> © 2024 AAFT</span> <br />
                            <span className='text-gray-500 text-xs mt-0'>Powered by AAFT</span> 
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="bg-red-500 p-2 rounded-md w-full text-white text-lg focus:outline-none text-bold"
                        title="Toggle Sidebar"
                    >
                        {sidebarOpen ? '<' : '>'}
                    </button>
                </div>
            </aside>



            {/* Main Content (scrollable) */}
            <main className="flex-1 overflow-y-auto p-3">
                <div className="rounded-lg shadow p-6 min-h-full">{children}</div>
            </main>
        </div>
    );
}
