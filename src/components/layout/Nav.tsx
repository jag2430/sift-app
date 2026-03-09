"use client";

import { useEffect, useState } from "react";

interface NavProps {
  onReset: () => void;
  showButton?: boolean;
}

export default function Nav({ onReset, showButton = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sift-nav ${scrolled ? "sift-nav--scrolled" : ""}`}>
      <div className="sift-nav-inner">
        <button onClick={onReset} className="sift-logo">
          Sift
        </button>
        {showButton && (
          <button onClick={onReset} className="sift-btn-primary sift-btn-primary-sm">
            Start Over
          </button>
        )}
      </div>
    </nav>
  );
}