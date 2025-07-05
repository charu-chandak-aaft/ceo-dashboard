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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        document.cookie.split(';').forEach((cookie) => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    };

    return (
        <div className="w-full h-screen flex overflow-hidden bg-[#0B1320] text-white relative">
            {/* Hamburger Button (mobile only) */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-red-500 text-white md:hidden"
                title="Open Menu"
            >
                {/* Hamburger Icon */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className='right-[15px] fixed top-4 z-50 rounded-md md:hidden'>
                <Image
                            src="/logos/aaft_connect_logo.png"
                            alt="AAFT Logo"
                            width={140}
                            height={40}
                            priority
                            className="items-center"
                        />
            </div>
            {/* Sidebar */}
            <aside
                className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          top-0 left-0
          w-full md:w-60
          bg-[#0E1628]
          text-white
          p-4
          transition-transform duration-300 ease-in-out
          flex flex-col justify-between
          h-screen
          z-[999]
        `}
            >
                <div>
                    {/* Close button (mobile only) */}
                    <div className="flex justify-between items-center md:hidden mb-4">
                        <span className="font-semibold">Menu</span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-white p-2"
                            title="Close Menu"
                        >
                            ✕
                        </button>
                    </div>

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
                        {/* <h3 className="text-gray-400 uppercase text-sm mb-2">
              Notifications
            </h3> */}
                        <ul className="space-y-3">
                            {/* <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                Profile
              </li>
              <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                Settings
              </li> */}
                            <li
                                className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                                onClick={handleLogout}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-4">
                    <div className="mb-3">
                        <span className="text-gray-300 text-xs font-semibold">© 2024 AAFT</span>
                        <br />
                        <span className="text-gray-500 text-xs mt-0">Powered by AAFT</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="bg-red-500 p-2 rounded-md w-full text-white text-lg focus:outline-none text-bold md:hidden"
                        title="Close Menu"
                    >
                        Close
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-3 md:ml-0 mt-[60px] lg:mt-0 md:mt-0">
                <div className="rounded-lg shadow p-1 lg:p-6 min-h-full">{children}</div>
            </main>
        </div>
    );
}
