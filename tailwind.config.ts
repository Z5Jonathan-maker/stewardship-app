import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand scales — UniFi
        // Evergreen: the calm, trustworthy "ink" (Monarch's warmth, our depth)
        evergreen: {
          50: "#eef6f2",
          100: "#d6e9df",
          200: "#aed3c0",
          300: "#7fb59c",
          400: "#519077",
          500: "#33745c",
          600: "#245a4a",
          700: "#1b443a",
          800: "#13322b",
          900: "#0c211c",
        },
        // Blue accent: swapped in for Monarch's orange
        brand: {
          50: "#eef3ff",
          100: "#dbe5ff",
          200: "#bdd0ff",
          300: "#93b0ff",
          400: "#6285fb",
          500: "#3b63f0",
          600: "#2849d8",
          700: "#2139ae",
          800: "#1f338a",
          900: "#1e306e",
        },
        // Cream / sand: the signature warm canvas
        cream: {
          50: "#fdfcf8",
          100: "#f8f5ec",
          200: "#efe9da",
          300: "#e4dac3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12, 33, 28, 0.04), 0 8px 24px -12px rgba(12, 33, 28, 0.12)",
        lift: "0 2px 4px rgba(12, 33, 28, 0.04), 0 18px 40px -16px rgba(12, 33, 28, 0.18)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
