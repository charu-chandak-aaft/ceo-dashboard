// app/admin/users/page.js

import React from 'react';

const Users = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Users</h1>
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Replace with dynamic content */}
          <tr className="border-b">
            <td className="px-6 py-4 text-sm text-gray-700">John Doe</td>
            <td className="px-6 py-4 text-sm text-gray-700">john@example.com</td>
            <td className="px-6 py-4 text-sm text-gray-700">Admin</td>
            <td className="px-6 py-4 text-sm text-gray-700">
              <button className="text-blue-500 hover:underline">Edit</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
