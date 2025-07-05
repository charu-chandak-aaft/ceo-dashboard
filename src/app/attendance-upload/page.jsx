'use client';
import { useState, useEffect } from 'react';

export default function AttendanceUpload() {
  const [file, setFile] = useState(null);
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [status, setStatus] = useState({type:'', message:''});

  useEffect(() => {
    // Fetch organisations from backend
    const fetchOrgs = async () => {
      const res = await fetch('/api/organisations'); // Create this API route
      const data = await res.json();
      setOrganisations(data);
    };
    fetchOrgs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedOrg) {
      setStatus({type:'error', message:'Please select file and organisation'});
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('organisationId', selectedOrg);

    const res = await fetch('/api/attendance-new', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('data',data);
    if (res.ok) {
     setStatus({type:'success', message:'upload succesfully'});
     setFile(null);
      setSelectedOrg('');
    } else {
      setStatus({type:'error', message:data.error});
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">Upload Attendance Excel</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2">Select Organisation</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
          >
            <option value="">-- Choose Organisation --</option>
            {organisations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Upload Excel File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {status && (
        <p className={`mt-4 text-sm ${status.type=='error'? 'text-red-600': 'text-green-600'}  font-medium`}>{status.message}</p>
      )}
    </div>
  );
}
