import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sparta: {
          red: "#E8344E",
          "red-hover": "#D12342",
          "red-light": "#FF5A73",
          dark: "#1E1E1E",
          "dark-gray": "#2D2D2D",
          white: "#FFFFFF",
          cyan: "#00BCD4",
          purple: "#9C27B0",
          pink: "#FFE5ED",
          "light-blue": "#E3F2FD",
          "gray-50": "#F5F5F5",
          "gray-100": "#E0E0E0",
          "gray-200": "#CCCCCC",
          "gray-600": "#666666",
          "gray-700": "#444444",
          "gray-900": "#1E1E1E",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        pretendard: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
