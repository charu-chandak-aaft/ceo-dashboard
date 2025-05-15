"use client";

import { createContext, useContext, useState } from "react";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const [attendanceData, setAttendanceData] = useState(null);

  return (
    <AttendanceContext.Provider value={{ attendanceData, setAttendanceData }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  return useContext(AttendanceContext);
}
