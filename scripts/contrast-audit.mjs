// WCAG 2.2 contrast audit for tailwind.config.js tokens.
// Ratios per WCAG 2.x relative luminance (sRGB).
const TOKENS = {
  'bg / brand.cream': '#FDF8F3',
  'brand.lime': '#D4F938',
  'brand.purple': '#D8B4FE',
  'brand.pink': '#FFD6F6',
  'brand.orange': '#FF9F1C',
  'brand.black': '#111111',
  'brand.gray': '#F3F4F6',
  'feedback.red': '#FF4444',
  'feedback.green': '#00CC66',
  'white': '#FFFFFF',
  'gray-50': '#F9FAFB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-700': '#374151',
};

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => srgb(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [la, lb] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
};
const fmt = (r) => r.toFixed(2);
const verdict = (r, large = false) => {
  const need = large ? 3.0 : 4.5;
  return r >= need ? 'PASS' : r >= 3.0 ? (large ? 'PASS' : 'FAIL body / pass large') : 'FAIL';
};

const FG = { 'black #000': '#000000', 'brand.black #111': '#111111', 'white #FFF': '#FFFFFF' };

console.log('=== TEXT ON TOKEN BACKGROUNDS (WCAG 1.4.3: body 4.5:1, large 3:1) ===\n');
for (const [bgName, bgHex] of Object.entries(TOKENS)) {
  const rows = Object.entries(FG).map(([fgName, fgHex]) => {
    const r = ratio(bgHex, fgHex);
    return `${fgName.padEnd(18)} ${fmt(r).padStart(6)}  body:${verdict(r).padEnd(22)} large:${verdict(r, true)}`;
  });
  console.log(`${bgName} (${bgHex})`);
  rows.forEach((x) => console.log('  ' + x));
  console.log('');
}

console.log('=== UI COMPONENT BOUNDARIES (WCAG 1.4.11: 3:1 vs adjacent) ===\n');
const pairs = [
  ['border-black on white', '#000000', '#FFFFFF'],
  ['border-black on bg cream', '#000000', '#FDF8F3'],
  ['border-black on brand.lime', '#000000', '#D4F938'],
  ['border-black on gray-50 (hover)', '#000000', '#F9FAFB'],
  ['brand.lime fill vs white', '#D4F938', '#FFFFFF'],
  ['brand.lime fill vs bg cream', '#D4F938', '#FDF8F3'],
  ['feedback.green fill vs white', '#00CC66', '#FFFFFF'],
  ['feedback.red fill vs white', '#FF4444', '#FFFFFF'],
  ['brand.orange fill vs white', '#FF9F1C', '#FFFFFF'],
  ['brand.gray fill vs white (disabled)', '#F3F4F6', '#FFFFFF'],
];
for (const [label, a, b] of pairs) {
  const r = ratio(a, b);
  console.log(`${label.padEnd(38)} ${fmt(r).padStart(6)}  ${r >= 3.0 ? 'PASS' : 'FAIL'}`);
}

console.log('\n=== DISABLED CTA (plan: bg-brand-gray text-gray-400) ===');
const dis = ratio('#F3F4F6', '#9CA3AF');
console.log(`gray-400 on brand.gray${' '.repeat(16)} ${fmt(dis).padStart(6)}  ${dis >= 4.5 ? 'PASS' : 'FAIL body'}`);
const dis2 = ratio('#F3F4F6', '#6B7280');
console.log(`gray-500 on brand.gray${' '.repeat(16)} ${fmt(dis2).padStart(6)}  ${dis2 >= 4.5 ? 'PASS' : 'FAIL body'}`);
