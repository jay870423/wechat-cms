import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"]
      },
      colors: {
        ink: "#0f172a",
        slate: "#1f2937",
        mist: "#f8fafc",
        jade: "#0f766e",
        jadeLight: "#5eead4",
        amber: "#f59e0b",
        rose: "#ef4444"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(94,234,212,0.35), transparent 55%), radial-gradient(circle at 80% 10%, rgba(245,158,11,0.2), transparent 45%), linear-gradient(135deg, #f8fafc, #eef2ff)"
      },
      boxShadow: {
        soft: "0 20px 60px -40px rgba(15, 118, 110, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
