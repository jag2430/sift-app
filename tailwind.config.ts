import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "steel-blue": "#547AA5",
        "steel-blue-hover": "#466A91",
        "warm-stone": "#A68B6B",
        "slate-ui": "#4F5165",
        "off-white": "#EFEFF0",
        "dark-teal": "#293132",
        "error-red": "#C0392B",
        "card-border": "#E0E0E2",
        "input-border": "#D0D0D2",
        "placeholder": "#9A9AA0",
      },
      fontFamily: {
        heading: ["Merriweather", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "720px",
        grid: "1080px",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
