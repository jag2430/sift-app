import type { ReactNode } from "react";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function OptionCard({
  selected,
  onClick,
  children,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`sift-option ${selected ? "sift-option--selected" : ""}`}
    >
      {children}
    </button>
  );
}