import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['var(--font-rubik)', 'Rubik', 'sans-serif'],
        'roboto': ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
      colors: {
        'ocean-blue': '#2B5797',
        'seafoam-green': '#4A9B8E', 
        'coral-pink': '#FF6B8A',
        'sandy-beige': '#F4E4BC',
        'sunset-orange': '#FF8C42',
        'pearl-white': '#F8F9FA',
        'deep-navy': '#1A365D',
        'soft-mint': '#8FD3C7',
      },
    },
  },
  plugins: [],
};

export default config;
