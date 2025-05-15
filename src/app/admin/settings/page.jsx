// app/admin/settings/page.js

import React from 'react';

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Settings</h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">Site Name</label>
          <input
            type="text"
            id="site-name"
            className="mt-2 block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="My Admin Panel"
          />
        </div>
        <div>
          <label htmlFor="site-url" className="block text-sm font-medium text-gray-700">Site URL</label>
          <input
            type="url"
            id="site-url"
            className="mt-2 block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://myadminpanel.com"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
