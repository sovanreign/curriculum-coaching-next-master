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
        primary: {
          '50': '#FFFAF5',
          '100': '#FFF4EB',
          '200': '#FFE1CF',
          '300': '#FFC8B0',
          '400': '#FF8A75',
          '500': '#FF3A3A',
          '600': '#E63030',
          '700': '#BF2121',
          '800': '#991515',
          '900': '#730B0B',
          '950': '#4A0505',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
