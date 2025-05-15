'use client';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export default function ReusableTable({ title, headers = [], data = [], children, height }) {
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  // const totalPages = Math.ceil(data.length / itemsPerPage);
  // const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const currentData = data;

  const handleExport = () => {
    const csvData = Papa.unparse(
      data.map((row) => {
        const flatRow = {};
        headers.forEach((header) => {
          flatRow[header.label] = row[header.key];
        });
        return flatRow;
      })
    );

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${title.replace(/\s+/g, '_')}_export.csv`);
  };

  return (
    <div className='bg-white rounded-xl py-3'>
      {/* <div className='flex justify-between items-center pb-3'>
        <div className='text-lg font-bold'>{title}</div>
        <button
          onClick={handleExport}
          className="text-sm px-3 py-1 rounded-full bg-green-600 hover:bg-green-700 text-white"
        >
          Export CSV
        </button>
      </div> */}

      {/* <div className="rounded-lg border border-gray-200 shadow-md"> */}
        {/* <table className="min-w-full border-collapse border border-gray-200 text-gray-900">
          <thead className="text-sm font-medium bg-[#EFEFF4]">
            <tr className="text-left">
              {headers.map((header, i) => (
                <th key={i} className="border border-gray-100 px-4 py-2">{header.label}</th>
              ))}
            </tr>
          </thead>
        </table> */}

        {/* <div className="max-h-[195px] overflow-auto scrollbar-hide">
          <table className="min-w-full border-collapse border border-gray-200 text-gray-900">
            <tbody className="text-sm">
              {children(currentData)}
            </tbody>
          </table>
        </div> */}
         <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden">
        <div className="overflow-auto scrollbar-hide" style={{ maxHeight: height }}>
          <table className="min-w-full border-collapse text-gray-900">
            {/*
              We assume children includes:
              <thead> with sticky top
              <tbody> inside a scrollable wrapper
            */}
            {children}
          </table>
        </div>
      </div>
      {/* </div> */}

      {/* <div className="flex justify-end mt-4 space-x-2 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1">{currentPage} / {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
