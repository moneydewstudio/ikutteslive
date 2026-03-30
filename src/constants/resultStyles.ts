export const RESULT_STYLES = {
  bgColor: '#D4F938',            // Tailwind: bg-brand-lime
  fontFamily: "'Inter', sans-serif",

  label: {
    fontSize: '1.5rem',          // 24px (was 12px)
    fontWeight: 700,             // font-bold
    lineHeight: '2rem',          // 32px (was 16px)
    letterSpacing: '0.2em',      // tracking-[0.2em]
    textTransform: 'uppercase' as const,
  },

  bigPercent: {
    fontSize: '20rem',           // 320px (was 128px)
    fontWeight: 900,             // font-black
    lineHeight: 1,               // text-9xl line-height
  },

  description: {
    fontSize: '2.5rem',         // 40px (was 20px)
    fontWeight: 700,             // font-bold
    lineHeight: '3.5rem',       // 56px (was 28px)
  },
} as const;
