'use client';
import HeaderBar from "@/app/components/shared/HeaderBar";
import { useProfileContext } from "@/app/context/ProfileContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import withAuth from "../../../../lib/withAuth";

const Dashboard = () => {
  const { profileDetails } = useProfileContext();
  // console.log("profileDetails", profileDetails);
  const externalLinks = {
    leadsquared: "https://identity.leadsquared.com/",
    camu: "https://staff.aaft.com/#/?id=65e2bdb9920f21a6f8a4ceb8",
    salesken: "https://www.salesken.ai",
    mcube: "https://app.mcube.com",
    superset: "https://app.joinsuperset.com/#/s/feed",
    almashine: "https://alumni.aaft.com/account?cid=1371",
    crc: "#",
    "chatbot-dashboard": "https://support.aaft.com/dashboard",
    "chatbot-university-dashboard": "https://support.aaft.edu.in/dashboard",
    "attendance-dashboard": "/management/school-attendance",
    "referal-dashboard": "https://referral.aaft.com/",
    "marketing-anly": "#",
    // "sales-analytics": "#",
  };

  const formatFileName = (title) => title.toLowerCase().replace(/\s|\./g, "-");

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <HeaderBar profile={profileDetails?.designation} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg-grid-custom">
        {/* Left Side Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            "Leadsquared",
            "Camu",
            "Superset",
            "Almashine",
            "MCube",
            "ChatBot Dashboard",
            "ChatBot University Dashboard",
            "Referal Dashboard",
            "Attendance Dashboard",
            // "Sales Analytics",
          ].map((title, index) => {
            const fileName = formatFileName(title) + ".png";
            const key = formatFileName(title);
            // console.log('key', key);
            const link = externalLinks[key] || "#";

            return (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg text-center relative flex items-center justify-center flex-col mt-10"
              >
                <div className="absolute -top-8 bg-white p-2 rounded-lg shadow-md">
                  <img
                    src={`/logos/${fileName}`}
                    alt={`${title} Logo`}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <div className="text-center mt-8">
                  <h3 className="text-white text-lg font-bold">{title}</h3>
                  <Link href={link} target="_blank" rel="noopener noreferrer">
                    <p className="text-gray-400 text-sm hover:underline">Click and Login</p>
                  </Link>
                </div>
                <Link href={link} target="_blank" rel="noopener noreferrer">
                <div className="absolute bottom-[-1px] right-[-1px] cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 36 36"
                  >
                    <g transform="translate(-627.614 -560.614)">
                      <circle
                        cx="18"
                        cy="18"
                        r="18"
                        transform="translate(627.614 560.614)"
                        fill="#0b9afc"
                        opacity="0.26"
                      />
                      <path
                        d="M.38,12.715a1.317,1.317,0,0,1,0-1.852L8.554,2.62H3.9A1.31,1.31,0,0,1,3.9,0h7.793a1.281,1.281,0,0,1,.629.164l.008,0,.016.009.016.01.008,0,.022.014h0a1.312,1.312,0,0,1,.572.839v0l.005.029v0l0,.026v.007l0,.024v.008l0,.023v.01c0,.008,0,.016,0,.024v.008c0,.009,0,.017,0,.026v.007c0,.01,0,.019,0,.029s0,0,0,0,0,.022,0,.033h0V9.17a1.3,1.3,0,1,1-2.6,0v-4.7L2.217,12.715a1.292,1.292,0,0,1-1.836,0Z"
                        transform="translate(639.611 571.413)"
                        fill="#0b9afc"
                      />
                    </g>
                  </svg>
                </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Side Profile & Goal */}
        <div className="p-6 text-center relative flex items-center flex-col top-0">
          {/* <div className="bg-red-500 p-6 rounded-lg text-center">
            <h3 className="text-lg text-white">Marketing goal for the past year</h3>
            <p className="text-4xl font-bold text-white">$4,520.00</p>
            <p className="text-sm text-white">You reached 68% of your goal</p>
          </div> */}

          <div className="bg-gray-800 p-12 rounded-lg text-center relative flex items-center justify-center flex-col mt-1">
            <div className="absolute -top-8 p-2 rounded-lg shadow-md mb-4">
              <img
                src="/logos/profile.jpg"
                className="w-20 h-20 rounded-full border-4 border-green-400"
                alt="Profile"
              />
            </div>
            <div className="text-center mt-10">
              <h3 className="text-xl font-bold text-white">
                {profileDetails?.name || "Akshay Marwah"}
              </h3>
              <p className="text-blue-400">{profileDetails?.designation || "CEO"}</p>
              <p className="text-gray-400 text-xs mt-2">E-mail</p>
              <p className="text-gray-200 text-sm font-medium">{profileDetails?.email || "akshaymarwah@email.com"}</p>
              <p className="text-gray-400 text-xs mt-2">Phone</p>
              <p className="text-gray-200 text-sm font-medium">{profileDetails?.mobile || "+01 923 456 78"}</p>
              <p className="text-gray-400 text-xs mt-2">Location</p>
              <p className="text-gray-200 text-sm font-medium">{profileDetails?.address || "16/A Marwah Studio"}</p>
              {/* <div className="flex justify-center items-center space-x-2 mt-3">
                <img src="/contact1.jpg" className="w-8 h-8 rounded-full" alt="Contact 1" />
                <img src="/contact2.jpg" className="w-8 h-8 rounded-full" alt="Contact 2" />
                <span className="bg-gray-600 px-3 py-1 rounded-full text-sm text-white">+29</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Dashboard);
