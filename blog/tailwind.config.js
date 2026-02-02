/** @type {import('tailwindcss').Config} */
// TEAM_010: mirror root Tailwind theme for blog styling consistency
export default {
  content: [
    './src/**/*.{astro,ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FDF8F3',
        brand: {
          lime: '#D4F938',
          purple: '#D8B4FE',
          pink: '#FFD6F6',
          orange: '#FF9F1C',
          black: '#111111',
          cream: '#FDF8F3',
          gray: '#F3F4F6',
        },
        feedback: {
          red: '#FF4444',
          green: '#00CC66',
        },
      },
      boxShadow: {
        neo: '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '6px 6px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '1': '1px',
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
