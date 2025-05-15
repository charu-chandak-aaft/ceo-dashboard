// app/admin/layout.js

import React from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { AttendanceProvider } from "@/context/AttendanceContext";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-[#0B1320] text-white flex">
      <aside className="hidden lg:block w-50 bg-[#0E1628] p-6">
        <h1 className="text-2xl font-bold mb-10 text-red-500">AAFT CONNECT</h1>
        <nav>
          <ul className="space-y-4">
            <li className="bg-red-500 p-3 rounded-lg cursor-pointer">
              Dashboard
            </li>
            <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
              Analytics
            </li>
            <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
              Sales
            </li>
            <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
              Reports{" "}
              <span className="ml-2 bg-gray-600 px-2 py-1 rounded-full text-xs">
                17
              </span>
            </li>
          </ul>
        </nav>
        <div className="mt-10">
          <h3 className="text-gray-400 uppercase text-sm mb-3">
            Notifications
          </h3>
          <ul className="space-y-4">
            <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
              Profile
            </li>
            <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
              Settings
            </li>
            <Link href='/user/login'>
              <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                Logout
              </li>
            </Link>
          </ul>
        </div>
        <div className="mt-10 text-gray-500 text-xs">
          © 2024 AAFT <br /> Powered by AAFT
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-3 container mx-3 bg-grey-100">
        <AttendanceProvider><div className="rounded-lg shadow-lg p-6">{children}</div></AttendanceProvider>
      </div>
    </div>
  );
}
