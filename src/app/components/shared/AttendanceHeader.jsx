'use client';

export default function AttendanceHeader() {
  // Menu with label and href
  const menuItems = [
    { label: 'Leadsquared', href: 'https://identity.leadsquared.com/",' },
    { label: 'Camu', href: 'https://www.camudigitalcampus.com' },
    { label: 'LMS', href: '/lms' },
    { label: 'Superset', href: 'https://joinsuperset.co' },
    { label: 'Marketing Anly.', href: '/marketing-analytics' },
    { label: 'Sales Analytics', href: 'https://www.salesken.ai' },
    { label: 'Almashine', href: '/almashine' },
    { label: 'Revenue', href: '/revenue' }
  ];

  return (
    <header className="flex justify-between items-center bg-black px-6 py-3">
      <div className="flex items-center gap-6 text-sm font-medium text-white">
        <div className="flex">
          <img src="/logos/aaft-icon.png" alt="AAFT Logo" className="h-8 pe-3" />
          <span className="my-auto text-sm font-semibold">Attendance Dashboard Overview</span>
        </div>

        <div className="px-4 flex flex-wrap items-center">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-gray-300 text-xs font-semibold hover:text-red-400 px-3"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center cursor-pointer gap-2">
        <img
          src="/logos/profile.jpg"
          alt="User Avatar"
          className="w-9 h-9 rounded-full"
        />
        <span className="text-gray-300 text-xs font-semibold hover:text-red-400">
          Logout
        </span>
      </div>
    </header>
  );
}
