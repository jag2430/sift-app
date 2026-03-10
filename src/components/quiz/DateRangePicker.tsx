"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
};

export default function DateRangePicker({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "white",
          border: "1px solid hsl(var(--border))",
          borderRadius: "16px",
          padding: "16px",
          width: "fit-content",
        }}
      >
        <DayPicker
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={1}
          disabled={{ before: new Date() }}
          weekStartsOn={0}
        />
      </div>
    </div>
  );
}