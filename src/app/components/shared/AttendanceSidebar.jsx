'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AttendanceSidebar() {
    const router = useRouter();
  const pathname = usePathname();
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
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      <div className="px-6 py-4 font-bold text-base">
        AAFT NOIDA Attendance
      </div>
      <nav className="flex flex-col gap-1 p-4 text-sm text-gray-700">
        <Link
          href="/management/school-attendance"
          className={`flex items-center gap-2 p-2 rounded-md font-semibold ${
            pathname === '/management/school-attendance'
              ? 'bg-purple-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <span>📊</span> Dashboard
        </Link>

        <Link
          href="/management/productivity"
          className={`flex items-center gap-2 p-2 rounded-md font-semibold ${
            pathname === '/management/productivity'
              ? 'bg-purple-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <span>📈</span> Productivity
        </Link>
      </nav>

      <div className="mt-auto p-4 text-sm text-gray-600">
        {/* <div className="flex items-center gap-2 mb-2 cursor-pointer hover:text-black">
          <span>🧑‍💼</span> Get Help
        </div> */}
        {/* <div className="flex items-center gap-2 mb-2 cursor-pointer hover:text-black">
          <span>🌐</span> English
        </div> */}
        <button className="flex items-center gap-2 text-red-500 hover:underline" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
