import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        coral: {
          DEFAULT: "#FF8B7B",
          light: "#FFB5A7",
          dark: "#E56B5A",
        },
        teal: {
          DEFAULT: "#71C9CE",
          light: "#A0E3E7",
          dark: "#4FA9AE",
        },
        // Background & Neutrals
        warm: {
          white: "#FAF7F2",
          gray: {
            50: "#F5F2ED",
            100: "#EAE5DC",
            200: "#D5CEC0",
            300: "#BFB6A4",
            400: "#A99E88",
            500: "#94866C",
            600: "#766B56",
            700: "#585041",
            800: "#3A352B",
            900: "#1C1A16",
          },
        },
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        comfort: "16px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.08)",
        gentle: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
