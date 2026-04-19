/** @type {import('tailwindcss').Config} */
// TEAM_033: Design System Refactor - Clean modern tokens
export default {
  content: [
    './src/**/*.{astro,ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      /* ============================================
         COLORS - Extended from CSS tokens
         ============================================ */
      colors: {
        // Primary semantic
        primary: {
          DEFAULT: '#111111',
          hover: '#333333',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          hover: '#e5e7eb',
        },

        // Status colors
        success: {
          DEFAULT: '#22c55e',
          light: '#dcfce7',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fef2f2',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
        },

        // Hub colors (semantic)
        tiu: '#D4F938',
        twk: '#FFD6F6',
        tkp: '#D8B4FE',

        // Legacy brand colors (for gradual migration)
        brand: {
          lime: '#D4F938',
          purple: '#D8B4FE',
          pink: '#FFD6F6',
          orange: '#FF9F1C',
          black: '#111111',
          cream: '#FDF8F3',
          gray: '#F3F4F6',
        },

        // Backgrounds
        bg: {
          DEFAULT: '#ffffff',
          subtle: '#f9fafb',
          cream: '#FDF8F3', // Legacy support
        },

        // Text
        text: {
          DEFAULT: '#111111',
          secondary: '#6b7280',
          muted: '#9ca3af',
          inverted: '#ffffff',
        },

        // Borders
        border: {
          DEFAULT: '#e5e7eb',
          strong: '#d1d5db',
          inverted: '#111111',
        },

        // Legacy feedback (for gradual migration)
        feedback: {
          red: '#FF4444',
          green: '#00CC66',
        },
      },

      /* ============================================
         TYPOGRAPHY - Extended scale
         ============================================ */
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],    // 36px
        'heading-1': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],  // 30px
        'heading-2': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],   // 24px
        'heading-3': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],   // 20px
        'heading-4': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }], // 18px
        'body': ['1rem', { lineHeight: '1.625' }],                            // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],                       // 14px
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],   // 12px
      },

      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      lineHeight: {
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
      },

      letterSpacing: {
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
      },

      /* ============================================
         SPACING - Extended scale
         ============================================ */
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '30': '7.5rem',   // 120px
      },

      /* ============================================
         MAX WIDTH - Container sizes
         ============================================ */
      maxWidth: {
        'prose': '65ch',
        'container': '720px',
        'wide': '1024px',
        'full': '1280px',
      },

      /* ============================================
         BORDERS & RADIUS
         ============================================ */
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',   // 4px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        'full': '9999px',
      },

      borderWidth: {
        'DEFAULT': '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',       // Legacy
      },

      /* ============================================
         SHADOWS - Modern subtle shadows
         ============================================ */
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        // Legacy neo-brutalist (for gradual migration)
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '6px 6px 0px 0px rgba(0,0,0,1)',
      },

      /* ============================================
         TRANSITIONS
         ============================================ */
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },

      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ============================================
         TYPOGRAPHY - Font family
         ============================================ */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },

      /* ============================================
         Z-INDEX
         ============================================ */
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal': '500',
        'tooltip': '700',
      },
    },
  },
  plugins: [],
};
