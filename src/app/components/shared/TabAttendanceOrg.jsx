'use client';

import { useEffect, useState } from 'react';

export default function TabSelector({ onSelect }) {
  const [tabs, setTabs] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    async function fetchTabs() {
      try {
        const res = await fetch('/api/organisations');
        const data = await res.json();
        setTabs(data);
        if (data.length > 0) {
          setActiveId(data[0].id);  // Select first tab by default
          onSelect(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching tabs:', error);
      }
    }

    fetchTabs();
  }, [onSelect]);

  const handleTabClick = (id) => {
    setActiveId(id);
    onSelect(id);
  };

  return (
    <div className="flex gap-0 bg-gray-100 p-4">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`px-4 py-2 text-xs font-semibold rounded-t-md border 
            ${activeId === tab.id 
              ? 'bg-black text-white border-black' 
              : 'bg-white text-black border-gray-300'
            } 
            ${index === 0 ? 'rounded-l-full' : ''}
            ${index === tabs.length - 1 ? 'rounded-r-full' : ''}`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
