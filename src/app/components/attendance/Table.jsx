import React from "react";

const Table = ({ children }) => {
  if (!children) {
    return <p className="text-red-500">No data available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow p-4 md:p-6 w-full bg-white">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th
              className="text-lg font-semibold text-gray-800 mb-4 px-4 py-2"
              colSpan="100%"
            >
              Subject Attendance Summary
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
