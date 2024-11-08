import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Typography } from "@material-tailwind/react";

interface DatePickerProps {
    label: string;
    selectedDate: Date | undefined;
    onSelect: (date: Date) => void;   
}

const DatePickerWithRange = ({ label, selectedDate, onSelect }: DatePickerProps) => {
    const defaultDate = selectedDate || new Date();

  return (
    <div>
      <Typography>{label}</Typography>
      <DayPicker
        mode="single"
        selected={defaultDate}
        onSelect={onSelect}
        required
      />
    </div>
  );
};

export default DatePickerWithRange;