"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const ProfileContext = createContext();

// Create the provider component
export const ProfileProvider = ({ children }) => {
  const [profileDetails, setProfileDetails] = useState(null);

  // Optional: load profile from localStorage on first load
  useEffect(() => {
    const storedProfile = localStorage.getItem("profileDetails");
    // console.log("storedProfile0",storedProfile);
    if (storedProfile) {
      // console.log("setprofile1")
      setProfileDetails(JSON.parse(storedProfile));
    }
  }, []);

  // Save profile to localStorage on change
  useEffect(() => {
    console.log("storedProfile1",profileDetails);
    if (profileDetails) {
      // console.log("465473737")
      localStorage.setItem("profileDetails", JSON.stringify(profileDetails));
    }
  }, [profileDetails]);

  return (
    <ProfileContext.Provider value={{ profileDetails, setProfileDetails }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use context
export const useProfileContext = () => useContext(ProfileContext);
