/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
    extend: {
      backgroundImage: {
        'taniko-pattern': "url('./assets/taniko.svg')",
        'light-banner': "url('./assets/light-nav-banner.svg')",
        'dark-banner': "url('./assets/dark-nav-banner.svg')",
      },
      colors: {
        white: "hsl(var(--white))",
        black: "hsl(var(--black))",
        primary: {
          DEFAULT: "hsl(var(--primary-100))",
          foreground: "hsl(var(--white))",
          110: "hsl(var(--primary-110))",
          100: "hsl(var(--primary-100))",
          75: "hsl(var(--primary-75))",
          50: "hsl(var(--primary-50))",
          25: "hsl(var(--primary-25))",
          5: "hsl(var(--primary-5))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary-100))",
          foreground: "hsl(var(--white))",
          110: "hsl(var(--secondary-110))",
          100: "hsl(var(--secondary-100))",
          75: "hsl(var(--secondary-75))",
          50: "hsl(var(--secondary-50))",
          25: "hsl(var(--secondary-25))",
          5: "hsl(var(--secondary-5))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent-25))",
          foreground: "hsl(var(--primary-100))",
          110: "hsl(var(--accent-110))",
          105: "hsl(var(--accent-105))",
          100: "hsl(var(--accent-100))",
          75: "hsl(var(--accent-75))",
          50: "hsl(var(--accent-50))",
          25: "hsl(var(--accent-25))",
          5: "hsl(var(--accent-5))",
        },
        sky: "hsl(var(--sky))",
        cream: "hsl(var(--cream))",
        bg: {
          green: "hsl(var(--bg-green))",
          yellow: "hsl(var(--bg-yellow))",
          red: "hsl(var(--bg-red))",
          purple: "hsl(var(--bg-purple))",
        },
        border: "hsl(var(--primary-100))",
        input: "hsl(var(--primary-25))",
        ring: "hsl(var(--primary-75))",
        background: "hsl(var(--cream))",
        foreground: "hsl(var(--primary-100))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--white))",
        },
        success: {
          DEFAULT: "hsl(var(--success))"
        },
        muted: {
          DEFAULT: "hsl(var(--secondary-5))",
          foreground: "hsl(var(--secondary-25))",
        },
        popover: {
          DEFAULT: "hsl(var(--white))",
          foreground: "hsl(var(--primary-100))",
        },
        card: {
          DEFAULT: "hsl(var(--white))",
          foreground: "hsl(var(--primary-100))",
        },
      },
      fontSize: {
        h1: '32px',
        h2: '24px',
        h3: '20px',
        h4: '18px',
        h5: '16px',
        h6: '15px',
        p: '14px',
        sm: '12px',
        xs: '10px',
        'mobile-h1': '24px',
        'mobile-h2': '20px',
        'mobile-h3': '18px',
        'mobile-h4': '16px',
        'mobile-h5': '15px',
        'mobile-h6': '14px',
        'mobile-p': '12px',
        'mobile-sm': '10px',
        'mobile-xs': '8px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require("tailwindcss-animate"),
    require("tailwindcss-rtl"),
  ],
}