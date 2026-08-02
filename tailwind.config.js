/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{App,components,services}/**/*.{ts,tsx}",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FDF8F3',
        brand: {
          lime: '#D4F938',    // Key OpenArt Lime
          purple: '#D8B4FE',  // Soft Purple
          pink: '#FFD6F6',    // Soft Pink
          orange: '#FF9F1C',
          black: '#111111',
          cream: '#FDF8F3',
          gray: '#F3F4F6'
        },
        feedback: {
          red: '#FF4444',
          green: '#00CC66',
        }
      },
            borderWidth: {
        '1': '1px',
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
    },
  },
  plugins: [],
}