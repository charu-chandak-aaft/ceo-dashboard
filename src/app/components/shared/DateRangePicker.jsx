// components/DateRangePicker.jsx
"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <DatePicker
        selected={startDate}
        onChange={(date) => onChange("start", date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="dd/MM/yyyy"
        className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500"
        popperPlacement="bottom-end"
        maxDate={new Date()}
        placeholderText="Start Date"
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        selected={endDate}
        onChange={(date) => onChange("end", date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        maxDate={new Date()}
        dateFormat="dd/MM/yyyy"
        className="w-30 px-4 py-1 text-center rounded-full bg-[#F5F5F7] text-gray-700 text-sm border-0 focus:ring-2 focus:ring-violet-500"
        popperPlacement="bottom-end"
        placeholderText="End Date"
      />
    </div>
  );
};

export default DateRangePicker;
