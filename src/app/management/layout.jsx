'use client';
import { useState } from 'react';
import AttendanceHeader from '../components/shared/AttendanceHeader';
import AttendanceSidebar from '../components/shared/AttendanceSidebar';
import { AttendanceProvider } from '@/context/AttendanceContext';

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState("AAFT NOIDA");

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <AttendanceHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <AttendanceSidebar />

        {/* Main Area with scrollable content below tabs */}
        <div className="flex-1 flex flex-col bg-gray-100">
          
          {/* Tabs Section - Fixed */}
          <div className="flex justify-between items-center px-4 pt-4 z-10">
            <div className="flex gap-1 p-1 rounded-t-lg">
              {['AAFT NOIDA', 'AAFT UNIVERSITY'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-t-lg text-xs font-medium shadow ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* <div className="text-gray-500 text-sm">02/04/2025</div> */}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 px-5 py-4">
            <AttendanceProvider>
              <main className='pb-6'>
                {children}
              </main>
            </AttendanceProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
