// TEAM_030: Generate 51 Formasi CPNS programmatic pages with REAL DATA
// Usage: npx tsx scripts/generateFormasiContent.ts > ../db/seed/20260415_formasi_real_data.sql

import {
  institutionData,
  provinceData,
  educationLevels,
  cityData,
  type InstitutionData,
  type ProvinceData,
  type FormationEntry
} from '../data/cpns2024RealData.js';

// Legacy config for backwards compatibility (will be replaced by real data)
const EDUCATION_LEVELS = [
  { level: 'SMA', slug: 'sma', description: 'Lulusan SMA/SMK' },
  { level: 'D3', slug: 'd3', description: 'Lulusan Diploma 3' },
  { level: 'S1', slug: 's1', description: 'Lulusan Strata 1' },
  { level: 'S2', slug: 's2', description: 'Lulusan Magister' },
];

// Content block types (aligned with existing blog)
type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'cta'; style: 'hard' | 'soft' };

// Templates
const SKD_CTA_TEXT = `Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN.`;

const generateProvinceContent = (province: ProvinceData): ContentBlock[] => {
  const cityLinks = province.cities.slice(0, 5).join(', ');
  const instList = province.institutions.slice(0, 6).join(', ');
  return [
    { type: 'paragraph', text: `Pendaftaran CPNS ${province.name} membuka peluang besar dengan total ${province.total_quota.toLocaleString()} kuota. Berdasarkan data resmi BKN 2024, ${province.total_institutions} instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan.` },
    { type: 'paragraph', text: `Informasi formasi CPNS ${province.name} meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024.` },
    { type: 'heading', level: 2, text: 'Ringkasan Formasi' },
    { type: 'list', ordered: false, items: [
      `Total Kuota: ${province.total_quota.toLocaleString()} orang`,
      `Total Instansi: ${province.total_institutions} instansi`,
      `Kota Penempatan: ${province.cities.length} kota/kabupaten`,
      `Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2`
    ]},
    { type: 'heading', level: 2, text: 'Instansi dengan Formasi Terbanyak' },
    { type: 'paragraph', text: `Instansi utama yang membuka formasi di ${province.name} meliputi: ${instList}, dan lainnya.` },
    { type: 'heading', level: 2, text: 'Kota/Kabupaten dengan Formasi' },
    { type: 'paragraph', text: `Formasi CPNS ${province.name} tersebar di berbagai lokasi utama: ${cityLinks}, serta kota/kabupaten lainnya di wilayah ${province.name}.` },
    { type: 'heading', level: 2, text: 'Persyaratan Umum CPNS 2024' },
    { type: 'list', ordered: false, items: [
      'Warga Negara Indonesia (WNI)',
      'Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)',
      'Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)',
      'Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap',
      'Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat',
      'Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)'
    ]},
    { type: 'heading', level: 2, text: 'Alur Pendaftaran CPNS 2024' },
    { type: 'list', ordered: true, items: [
      'Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil',
      'Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)',
      'Unggah dokumen persyaratan sesuai ketentuan instansi',
      'Tunggu pengumuman seleksi administrasi',
      'Cetak kartu peserta ujian (jika lolos administrasi)',
      'Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN',
      'Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan',
      'Pengumuman akhir dan pengangkatan'
    ]},
    { type: 'heading', level: 2, text: 'Tips Lolos CPNS' },
    { type: 'list', ordered: false, items: [
      'Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)',
      'Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)',
      'Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir',
      'Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT',
      'Simak pengumuman resmi dari masing-masing instansi'
    ]},
    { type: 'heading', level: 2, text: SKD_CTA_TEXT },
    { type: 'cta', style: 'hard' },
    { type: 'paragraph', text: `Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru.` },
  ];
};

const generateCityContent = (province: ProvinceData, city: typeof cityData[0]): ContentBlock[] => {
  return [
    { type: 'paragraph', text: `${city.name} adalah salah satu kota penting di ${province.name} yang membuka formasi CPNS 2024 dengan total ${city.totalQuota.toLocaleString()} kuota. Terdapat ${city.totalInstitutions} instansi yang membuka formasi di kota ini.` },
    { type: 'paragraph', text: `Pelamar CPNS asal ${city.name} atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal.` },
    { type: 'heading', level: 2, text: 'Ringkasan Formasi' },
    { type: 'list', ordered: false, items: [
      `Total Kuota: ${city.totalQuota.toLocaleString()} orang`,
      `Total Instansi: ${city.totalInstitutions} instansi`,
      `Wilayah: ${city.name}, Provinsi ${province.name}`
    ]},
    { type: 'heading', level: 2, text: 'Instansi yang Membuka Formasi' },
    { type: 'paragraph', text: `Instansi yang membuka formasi di ${city.name} meliputi: ${province.institutions.slice(0, 8).join(', ')}, dan instansi lainnya.` },
    { type: 'heading', level: 2, text: 'Persyaratan Umum' },
    { type: 'list', ordered: false, items: [
      'WNI, usia 18-35 tahun (40 untuk dokter)',
      'Sehat jasmani dan rohani',
      'Tidak pernah dihukum penjara',
      'Ijazah diakui Kemendikbud',
      'Dokumen lengkap sesuai ketentuan'
    ]},
    { type: 'heading', level: 2, text: SKD_CTA_TEXT },
    { type: 'cta', style: 'hard' },
  ];
};

const generateInstitutionContent = (institution: InstitutionData): ContentBlock[] => {
  const formationItems = institution.formations.map(f => 
    `**${f.position}** — ${f.quota.toLocaleString()} kuota (${f.education_required})`
  );
  
  const contentBlocks: ContentBlock[] = [
    { type: 'paragraph', text: `${institution.name} membuka formasi CPNS 2024 dengan total ${institution.total_quota.toLocaleString()} kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN.` },
    { type: 'paragraph', text: `Formasi ${institution.name} mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar.` },
    { type: 'heading', level: 2, text: 'Daftar Formasi dan Kuota' },
    { type: 'list', ordered: false, items: formationItems }
  ];
  
  // Add requirements note if exists
  const formationsWithReqs = institution.formations.filter(f => f.additional_requirements);
  if (formationsWithReqs.length > 0) {
    contentBlocks.push({ type: 'heading', level: 2, text: 'Persyaratan Khusus' });
    for (const f of formationsWithReqs.slice(0, 3)) {
      contentBlocks.push({
        type: 'paragraph',
        text: `**${f.position}:** ${f.additional_requirements}`
      });
    }
  }
  
  contentBlocks.push({ type: 'heading', level: 2, text: 'Proses Seleksi' });
  contentBlocks.push({
    type: 'list',
    ordered: true,
    items: [
      'Seleksi Administrasi (verifikasi berkas)',
      'Seleksi Kompetensi Dasar (SKD) - CAT BKN',
      'Seleksi Kompetensi Bidang (SKB) - jika diperlukan',
      'Pengumuman akhir dan pengangkatan'
    ]
  });
  contentBlocks.push({ type: 'heading', level: 2, text: SKD_CTA_TEXT });
  contentBlocks.push({ type: 'cta', style: 'hard' });
  
  return contentBlocks;
};

const generateEducationContent = (education: typeof educationLevels[0]): ContentBlock[] => {
  const allFormations = institutionData.flatMap(i => i.formations);
  const relevantFormations = allFormations.filter(f => 
    f.education_required.toLowerCase().includes(education.level.toLowerCase()) ||
    (education.level === 'S1' && f.education_required.includes('S1')) ||
    (education.level === 'D3' && f.education_required.includes('D3'))
  );
  
  const instList = [...new Set(relevantFormations.map(f => f.institution))].slice(0, 8);
  const topPositions = relevantFormations
    .sort((a, b) => b.quota - a.quota)
    .slice(0, 5)
    .map(f => f.position);
  
  return [
    { type: 'paragraph', text: `Lulusan ${education.level} memiliki peluang besar dalam seleksi CPNS 2024 dengan total ${education.totalQuota.toLocaleString()} kuota tersedia. Banyak instansi membuka formasi khusus untuk jenjang pendidikan ini.` },
    { type: 'paragraph', text: `${education.description} Berikut adalah informasi lengkap instansi dan jabatan yang dapat dilamar.` },
    { type: 'heading', level: 2, text: 'Instansi yang Menerima' },
    { type: 'paragraph', text: `Instansi yang membuka formasi untuk lulusan ${education.level}: ${instList.join(', ')}, dan lainnya.` },
    { type: 'heading', level: 2, text: 'Jabatan dengan Kuota Terbanyak' },
    { type: 'list', ordered: false, items: topPositions },
    { type: 'heading', level: 2, text: 'Tips Daftar CPNS' },
    { type: 'list', ordered: false, items: [
      'Pilih formasi sesuai jurusan/jenjang pendidikan',
      'Perhatikan persyaratan tambahan setiap instansi',
      'Siapkan dokumen lengkap sebelum pendaftaran',
      'Pelajari pola soal SKD sesuai jenjang pendidikan'
    ]},
    { type: 'heading', level: 2, text: 'Posisi dengan Persaingan Rendah' },
    { type: 'paragraph', text: `Posisi dengan kuota besar dan persaingan relatif rendah untuk lulusan ${education.level} meliputi: Pengawal Tahanan (Kemenkumham), Panitera (MA), dan Analis Keimigrasian.` },
    { type: 'heading', level: 2, text: SKD_CTA_TEXT },
    { type: 'cta', style: 'hard' },
  ];
};

// SQL generators
const escapeSqlString = (str: string): string => {
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
};

const contentBlocksToJson = (blocks: ContentBlock[]): string => {
  return JSON.stringify(blocks);
};

const generateProvinceInsert = (province: ProvinceData): string => {
  const slug = province.slug;
  const title = `Formasi CPNS ${province.name} 2024 — ${province.total_quota.toLocaleString()} Kuota, ${province.total_institutions} Instansi`;
  const metaDescription = `Info lengkap formasi CPNS ${province.name}: ${province.total_institutions} instansi, ${province.total_quota.toLocaleString()} kuota, kota: ${province.cities.slice(0,3).join(', ')}. Data terbaru 2024.`;
  const contentBlocks = generateProvinceContent(province);
  const targetKeywords = `{${[
    `formasi cpns ${province.slug}`,
    `cpns ${province.slug}`,
    `formasi cpns ${province.slug} 2024`,
    `lowongan cpns ${province.slug}`
  ].map(k => `"${k}"`).join(',')}}`;

  // Build formations_data from province institutions
  const formationsData = province.institutions.map(instName => {
    const inst = institutionData.find(i => i.name.toLowerCase().includes(instName.toLowerCase()));
    return inst ? inst.formations : [];
  }).flat();
  
  return `-- Province: ${province.name}
INSERT INTO formasi_pages (slug, page_type, province, province_slug, title, meta_description, target_keywords, content_blocks, formations_data, total_quota, total_institutions, has_placeholder_data, data_source, created_at, updated_at) VALUES (
  '${slug}',
  'province',
  '${escapeSqlString(province.name)}',
  '${slug}',
  '${escapeSqlString(title)}',
  '${escapeSqlString(metaDescription)}',
  '${targetKeywords}',
  '${escapeSqlString(contentBlocksToJson(contentBlocks))}'::jsonb,
  '${escapeSqlString(JSON.stringify(formationsData))}'::jsonb,
  ${province.total_quota},
  ${province.total_institutions},
  false,
  'BKN 2024 Official',
  NOW(),
  NOW()
);`;
};

const generateCityInsert = (province: ProvinceData, city: typeof cityData[0]): string => {
  const slug = `${province.slug}-${city.slug}`;
  const title = `Formasi CPNS ${city.name}, ${province.name} — ${city.totalQuota.toLocaleString()} Kuota, ${city.totalInstitutions} Instansi`;
  const metaDescription = `Formasi CPNS ${city.name}, ${province.name} 2024: ${city.totalInstitutions} instansi, ${city.totalQuota.toLocaleString()} kuota. Info lengkap dan persyaratan.`;
  const contentBlocks = generateCityContent(province, city);
  const targetKeywords = `{${[
    `formasi cpns ${city.slug}`,
    `cpns ${city.slug}`,
    `formasi cpns ${city.slug} ${province.slug}`,
    `lowongan cpns ${city.slug}`
  ].map(k => `"${k}"`).join(',')}}`;

  // Build formations_data from province institutions
  const formationsData = province.institutions.map(instName => {
    const inst = institutionData.find(i => i.name.toLowerCase().includes(instName.toLowerCase()));
    return inst ? inst.formations : [];
  }).flat();
  
  return `-- City: ${city.name}, ${province.name}
INSERT INTO formasi_pages (slug, page_type, province, province_slug, city, city_slug, title, meta_description, target_keywords, content_blocks, formations_data, total_quota, total_institutions, has_placeholder_data, data_source, created_at, updated_at) VALUES (
  '${slug}',
  'city',
  '${escapeSqlString(province.name)}',
  '${province.slug}',
  '${escapeSqlString(city.name)}',
  '${city.slug}',
  '${escapeSqlString(title)}',
  '${escapeSqlString(metaDescription)}',
  '${targetKeywords}',
  '${escapeSqlString(contentBlocksToJson(contentBlocks))}'::jsonb,
  '${escapeSqlString(JSON.stringify(formationsData))}'::jsonb,
  ${city.totalQuota},
  ${city.totalInstitutions},
  false,
  'BKN 2024 Official',
  NOW(),
  NOW()
);`;
};

const generateInstitutionInsert = (institution: InstitutionData): string => {
  const slug = institution.slug;
  const title = `Formasi CPNS ${institution.name} 2024 — ${institution.total_quota.toLocaleString()} Kuota, Seluruh Indonesia`;
  const metaDescription = `${institution.total_quota.toLocaleString()} formasi CPNS ${institution.name} untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.`;
  const contentBlocks = generateInstitutionContent(institution);
  const targetKeywords = `{${[
    `formasi cpns ${institution.slug}`,
    `cpns ${institution.slug}`,
    `formasi ${institution.slug}`,
    `lowongan ${institution.slug}`
  ].map(k => `"${k}"`).join(',')}}`;
  
  return `-- Institution: ${institution.name}
INSERT INTO formasi_pages (slug, page_type, institution, institution_slug, title, meta_description, target_keywords, content_blocks, formations_data, total_quota, total_institutions, has_placeholder_data, data_source, created_at, updated_at) VALUES (
  '${slug}',
  'institution',
  '${escapeSqlString(institution.name)}',
  '${slug}',
  '${escapeSqlString(title)}',
  '${escapeSqlString(metaDescription)}',
  '${targetKeywords}',
  '${escapeSqlString(contentBlocksToJson(contentBlocks))}'::jsonb,
  '${escapeSqlString(JSON.stringify(institution.formations))}'::jsonb,
  ${institution.total_quota},
  ${institution.formations.length},
  false,
  'BKN 2024 Official',
  NOW(),
  NOW()
);`;
};

const generateEducationInsert = (education: typeof educationLevels[0]): string => {
  const slug = `untuk-${education.slug}`;
  const title = `Formasi CPNS untuk Lulusan ${education.level} 2024 — ${education.totalQuota.toLocaleString()} Kuota`;
  const metaDescription = `Daftar formasi CPNS 2024 yang menerima lulusan ${education.level}: ${education.totalQuota.toLocaleString()} kuota tersedia. Instansi, jabatan, dan persyaratan lengkap.`;
  const contentBlocks = generateEducationContent(education);
  const targetKeywords = `{${[
    `formasi cpns ${education.slug}`,
    `cpns ${education.slug}`,
    `formasi cpns ${education.level}`,
    `lowongan cpns ${education.level}`
  ].map(k => `"${k}"`).join(',')}}`;

  // Build formations_data for this education level
  const allFormations = institutionData.flatMap(i => i.formations);
  const formationsData = allFormations.filter(f => 
    f.education_required.toLowerCase().includes(education.level.toLowerCase()) ||
    (education.level === 'S1' && f.education_required.includes('S1')) ||
    (education.level === 'SMA' && f.education_required.includes('SMA'))
  );
  
  return `-- Education: ${education.level}
INSERT INTO formasi_pages (slug, page_type, education_level, title, meta_description, target_keywords, content_blocks, formations_data, total_quota, total_institutions, has_placeholder_data, data_source, created_at, updated_at) VALUES (
  '${slug}',
  'education',
  '${education.slug}',
  '${escapeSqlString(title)}',
  '${escapeSqlString(metaDescription)}',
  '${targetKeywords}',
  '${escapeSqlString(contentBlocksToJson(contentBlocks))}'::jsonb,
  '${escapeSqlString(JSON.stringify(formationsData))}'::jsonb,
  ${education.totalQuota},
  ${education.totalInstitutions},
  false,
  'BKN 2024 Official',
  NOW(),
  NOW()
);`;
};

// Main generation
const generateAll = (): string => {
  const inserts: string[] = [];
  
  // Calculate counts
  const provinceCount = provinceData.length;
  const cityCount = cityData.length;
  const institutionCount = institutionData.length;
  const educationCount = educationLevels.length;
  const totalPages = provinceCount + cityCount + institutionCount + educationCount;
  
  // Header
  inserts.push(`-- TEAM_030: Formasi CPNS Programmatic Pages Seed Data - REAL DATA`);
  inserts.push(`-- Generated: ${new Date().toISOString()}`);
  inserts.push(`-- Source: BKN CPNS 2024 Official`);
  inserts.push(`-- Total Pages: ${totalPages} (${provinceCount} provinces + ${cityCount} cities + ${institutionCount} institutions + ${educationCount} education levels)`);
  inserts.push(`-- Note: All pages use real data (has_placeholder_data = false)`);
  inserts.push('');
  
  // Provinces
  inserts.push('-- === PROVINCE PAGES ===');
  for (const province of provinceData) {
    inserts.push(generateProvinceInsert(province));
    inserts.push('');
  }
  
  // Cities
  inserts.push('-- === CITY PAGES ===');
  for (const city of cityData) {
    const province = provinceData.find(p => p.name === city.province);
    if (province) {
      inserts.push(generateCityInsert(province, city));
      inserts.push('');
    }
  }
  
  // Institutions
  inserts.push('-- === INSTITUTION PAGES ===');
  for (const institution of institutionData) {
    inserts.push(generateInstitutionInsert(institution));
    inserts.push('');
  }
  
  // Education
  inserts.push('-- === EDUCATION PAGES ===');
  for (const education of educationLevels) {
    inserts.push(generateEducationInsert(education));
    inserts.push('');
  }
  
  // Summary
  inserts.push('-- === SUMMARY ===');
  inserts.push(`-- Total INSERT statements: ${totalPages}`);
  inserts.push(`-- Total formations: ${institutionData.reduce((sum, i) => sum + i.total_quota, 0).toLocaleString()} positions`);
  inserts.push('-- Run this SQL after applying migration: 20260413_team_030_formasi_pages.sql');
  
  return inserts.join('\n');
};

// Execute - Write to file
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '..', '..', 'db', 'seed', '20260415_formasi_real_data.sql');
const output = generateAll();
fs.writeFileSync(outputPath, output, 'utf-8');
console.log(`Generated: ${outputPath}`);
console.log(`Total pages: ${provinceData.length + cityData.length + institutionData.length + educationLevels.length}`);
console.log(`Total formations: ${institutionData.reduce((sum, i) => sum + i.total_quota, 0).toLocaleString()} positions`);
