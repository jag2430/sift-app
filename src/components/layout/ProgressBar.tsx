import type { Step } from "@/types/quiz";

interface ProgressBarProps {
  step: Step;
}

export default function ProgressBar({ step }: ProgressBarProps) {
  const steps: Step[] = ["category", "date", "distance"];
  const idx = steps.indexOf(step);

  if (idx === -1) return null;

  return (
    <div
      className="sift-progress"
      style={{ position: "fixed", top: 65, left: 0, right: 0, zIndex: 49 }}
    >
      <div
        className="sift-progress-fill"
        style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
      />
    </div>
  );
}