'use client';
import { useState } from 'react';
import AttendanceHeader from '../components/shared/AttendanceHeader';
import AttendanceSidebar from '../components/shared/AttendanceSidebar';
import { AttendanceProvider } from '@/context/AttendanceContext';

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState("AAFT NOIDA");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <AttendanceHeader />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-[#0E1628] transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex-shrink-0
          `}
        >
          <AttendanceSidebar />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100 min-w-0">
          {/* Top Section */}
          <div className="flex justify-between items-center px-4 pt-4 z-10">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-t-lg">
              {['AAFT NOIDA', 'AAFT UNIVERSITY'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-2 rounded-t-lg text-xs font-medium shadow ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-black text-white px-3 py-2 rounded focus:outline-none"
            >
              ☰
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 px-2 md:px-5 py-4 w-full overflow-x-auto">
            <AttendanceProvider>
              <main className="pb-6">{children}</main>
            </AttendanceProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
