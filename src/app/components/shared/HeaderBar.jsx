'use client';
import React, { useEffect, useState } from 'react';
import { FiSearch, FiChevronDown, FiBell } from 'react-icons/fi';
import Image from 'next/image';

export default function HeaderBar({profile}) {
  const [currentTime, setCurrentTime] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const date = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      setCurrentTime(`${time} at ${date}`);
    };

    updateTime(); // set initially
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1320] text-white flex items-center justify-between border-b border-gray-700">
      {/* Left Section */}
      <div>
        <h2 className="text-lg font-semibold">{profile} Dashboard Overview</h2>
        <p className="text-sm text-gray-400 mt-1">{currentTime}</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        {/* <div className="relative">
          <input
            type="text"
            placeholder="search..."
            className="bg-[#1F2A40] text-white text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none w-48 md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
        </div> */}

        {/* Dropdown Filter */}
        {/* <div className="bg-[#1F2A40] flex items-center gap-1 px-3 py-2 rounded-md text-sm cursor-pointer">
          This Year
          <FiChevronDown className="text-gray-400 ml-1" />
        </div> */}

        {/* Notification Icon */}
        {/* <div className="bg-[#1F2A40] p-2 rounded-md cursor-pointer">
          <FiBell size={18} />
        </div> */}

        {/* Country Flag */}
        <div className="bg-[#1F2A40] p-1.5 rounded-md cursor-pointer">
          <Image
            src="/logos/indianFlag.jpg"
            alt="India Flag"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer">
          <Image
            src="/logos/profile.jpg"
            alt="User Avatar"
            width={36}
            height={36}
          />
        </div>
      </div>
    </header>
  );
}
