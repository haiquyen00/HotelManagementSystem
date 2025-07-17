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
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.2s ease-out',
        'animate-in': 'animateIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        animateIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
