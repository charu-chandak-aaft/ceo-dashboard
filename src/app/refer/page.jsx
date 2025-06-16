import Head from 'next/head';

export default function StaticReferralForm() {
  return (
    <>
      <Head>
        <title>Referral Form</title>
      </Head>

      <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Referral Form</h1>

        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">

          {/* Referred By Section */}
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-white text-lg md:text-xl font-semibold">Referred By</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <label className="block mb-1 font-medium">Staff Name*</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Department*</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" placeholder="Department name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone*</label>
              <div className="relative">
                <span className="absolute left-0 bg-black text-white px-4 py-2 text-sm rounded-l">+91</span>
                <input type="text" maxLength={10} className="w-full border border-gray-300 pl-16 p-2 rounded" placeholder="Enter Mobile No." />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Email*</label>
              <input type="email" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter email" />
            </div>
            <div className="col-span-full">
              <label className="block mb-1 font-medium">Gender</label>
              <div className="flex gap-6 mt-2">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input type="radio" name="refer_gender" value={gender} className="mr-2" />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 mx-6 my-4"></div>

          {/* Reference Info Section */}
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-white text-lg md:text-xl font-semibold">Your Reference Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <label className="block mb-1 font-medium">First Name*</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter first name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Last Name*</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter last name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone*</label>
              <div className="relative">
                <span className="absolute left-0 bg-black text-white px-4 py-2 text-sm rounded-l">+91</span>
                <input type="text" maxLength={10} className="w-full border border-gray-300 pl-16 p-2 rounded" placeholder="Enter Mobile No." />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Email*</label>
              <input type="email" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">State*</label>
              <select className="w-full border border-gray-300 p-2 rounded">
                <option>Select State</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">City*</label>
              <select className="w-full border border-gray-300 p-2 rounded">
                <option>Select City</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Expected School*</label>
              <select className="w-full border border-gray-300 p-2 rounded">
                <option>Select School</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Expected Program of Interest*</label>
              <select className="w-full border border-gray-300 p-2 rounded">
                <option>Select Program</option>
              </select>
            </div>
            <div className="col-span-full">
              <label className="block mb-1 font-medium">Gender*</label>
              <div className="flex gap-6 mt-2">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input type="radio" name="friend_gender" value={gender} className="mr-2" />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md shadow hover:bg-blue-700 transition-all duration-200">
              Submit Referral
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
