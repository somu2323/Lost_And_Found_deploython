import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'base': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '500' }],
        'xl': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', fontWeight: '700' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;