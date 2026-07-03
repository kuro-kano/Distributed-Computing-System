import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          low: "#3b82f6",
          medium: "#eab308",
          high: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};

export default config;
