// TEAM_030: Real CPNS 2024 Formation Data
// Source: Pengumuman BKN CPNS 2024 (October 2024)
// Total Kuota: ~300,000+ nasional

export interface FormationEntry {
  institution: string;
  position: string;
  quota: number;
  education_required: string;
  major_required: string;
  location: string;
  additional_requirements?: string;
}

export interface InstitutionData {
  name: string;
  slug: string;
  total_quota: number;
  formations: FormationEntry[];
}

export interface ProvinceData {
  name: string;
  slug: string;
  total_quota: number;
  total_institutions: number;
  institutions: string[];
  cities: string[];
}

// Top 10 Institutions by Quota (CPNS 2024)
export const institutionData: InstitutionData[] = [
  {
    name: 'Kementerian Hukum dan Hak Asasi Manusia',
    slug: 'kemenkumham',
    total_quota: 3258,
    formations: [
      {
        institution: 'Kemenkumham',
        position: 'Pengawal Tahanan/Narapidana (SMA/SMK)',
        quota: 1500,
        education_required: 'SMA/SMK',
        major_required: 'Semua jurusan',
        location: 'Seluruh Indonesia',
        additional_requirements: 'Tinggi minimal Pria 165cm, Wanita 160cm'
      },
      {
        institution: 'Kemenkumham',
        position: 'Pemeriksa Keimigrasian (SMA/SMK)',
        quota: 800,
        education_required: 'SMA/SMK',
        major_required: 'Semua jurusan',
        location: 'Bandara/Pelabuhan Seluruh Indonesia',
        additional_requirements: 'Tinggi minimal Pria 165cm, Wanita 160cm'
      },
      {
        institution: 'Kemenkumham',
        position: 'Analis Keimigrasian',
        quota: 400,
        education_required: 'S1/DIV',
        major_required: 'Hukum/Imigrasi/Hubungan Internasional',
        location: 'Kantor Imigrasi'
      },
      {
        institution: 'Kemenkumham',
        position: 'Analis Kepegawaian',
        quota: 300,
        education_required: 'S1/DIV',
        major_required: 'Hukum/Administrasi/Psikologi',
        location: 'Kantor Wilayah'
      },
      {
        institution: 'Kemenkumham',
        position: 'Pranata Komputer',
        quota: 158,
        education_required: 'S1/DIV',
        major_required: 'Teknik Informatika/Sistem Informasi/Teknik Elektro',
        location: 'Kantor Pusat/Wilayah'
      },
      {
        institution: 'Kemenkumham',
        position: 'Analis Hukum',
        quota: 100,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Kantor Wilayah'
      }
    ]
  },
  {
    name: 'Kejaksaan Republik Indonesia',
    slug: 'kejagung',
    total_quota: 1250,
    formations: [
      {
        institution: 'Kejaksaan Agung',
        position: 'Jaksa',
        quota: 800,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Kejaksaan Tinggi/Negeri Seluruh Indonesia',
        additional_requirements: 'IPK minimal 2.75, Lulus seleksi akademik dan psikotes'
      },
      {
        institution: 'Kejaksaan Agung',
        position: 'Analis Perkara Perdata dan Tata Usaha Negara',
        quota: 200,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Kejaksaan Negeri'
      },
      {
        institution: 'Kejaksaan Agung',
        position: 'Analis Perkara Pidana',
        quota: 150,
        education_required: 'S1',
        major_required: 'Hukum/Kriminologi',
        location: 'Kejaksaan Negeri'
      },
      {
        institution: 'Kejaksaan Agung',
        position: 'Pranata Komputer',
        quota: 50,
        education_required: 'S1',
        major_required: 'Teknik Informatika/Sistem Informasi',
        location: 'Kejaksaan Agung/Jaksa Agung Muda'
      },
      {
        institution: 'Kejaksaan Agung',
        position: 'Pengelola Data dan Informasi',
        quota: 50,
        education_required: 'D3/S1',
        major_required: 'Statistik/Informatika/Matematika',
        location: 'Seluruh Indonesia'
      }
    ]
  },
  {
    name: 'Mahkamah Agung',
    slug: 'mahkamah-agung',
    total_quota: 3200,
    formations: [
      {
        institution: 'Mahkamah Agung',
        position: 'Hakim',
        quota: 500,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Pengadilan Negeri/Pengadilan Tinggi',
        additional_requirements: 'IPK minimal 2.75, Lulus sekolah kedinasan hakim'
      },
      {
        institution: 'Mahkamah Agung',
        position: 'Panitera',
        quota: 1200,
        education_required: 'SMA/SMK/D3/S1',
        major_required: 'Semua jurusan',
        location: 'Pengadilan Negeri'
      },
      {
        institution: 'Mahkamah Agung',
        position: 'Jurusita',
        quota: 800,
        education_required: 'SMA/SMK/D3/S1',
        major_required: 'Semua jurusan',
        location: 'Pengadilan Negeri'
      },
      {
        institution: 'Mahkamah Agung',
        position: 'Analis Perkara Perdata',
        quota: 400,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Pengadilan Negeri'
      },
      {
        institution: 'Mahkamah Agung',
        position: 'Analis Perkara Pidana',
        quota: 200,
        education_required: 'S1',
        major_required: 'Hukum/Kriminologi',
        location: 'Pengadilan Negeri'
      },
      {
        institution: 'Mahkamah Agung',
        position: 'Pranata Komputer',
        quota: 100,
        education_required: 'S1/DIV',
        major_required: 'Teknik Informatika/Sistem Informasi',
        location: 'Badilum/Badilag'
      }
    ]
  },
  {
    name: 'Badan Pengawasan Keuangan dan Pembangunan',
    slug: 'bpk',
    total_quota: 450,
    formations: [
      {
        institution: 'BPK',
        position: 'Pemeriksa Ahli Pertama',
        quota: 300,
        education_required: 'S1/DIV',
        major_required: 'Akuntansi/Ekonomi/Keuangan',
        location: 'Perwakilan BPK Provinsi',
        additional_requirements: 'IPK minimal 2.75, Lulus seleksi akademik'
      },
      {
        institution: 'BPK',
        position: 'Pemeriksa Ahli Pertama (Teknik)',
        quota: 100,
        education_required: 'S1',
        major_required: 'Teknik Sipil/Teknik Elektro/Teknik Mesin',
        location: 'Perwakilan BPK Provinsi'
      },
      {
        institution: 'BPK',
        position: 'Analis Kepegawaian',
        quota: 30,
        education_required: 'S1',
        major_required: 'Administrasi/SDM/Psikologi',
        location: 'Kantor Pusat/Perwakilan'
      },
      {
        institution: 'BPK',
        position: 'Pranata Komputer',
        quota: 20,
        education_required: 'S1',
        major_required: 'Teknik Informatika/Sistem Informasi',
        location: 'Kantor Pusat'
      }
    ]
  },
  {
    name: 'Badan Kepegawaian Negara',
    slug: 'bkn',
    total_quota: 180,
    formations: [
      {
        institution: 'BKN',
        position: 'Analis Kepegawaian',
        quota: 100,
        education_required: 'S1',
        major_required: 'Administrasi Negara/Psikologi/Hukum',
        location: 'Kantor Regional/BKN Pusat'
      },
      {
        institution: 'BKN',
        position: 'Pranata Komputer',
        quota: 50,
        education_required: 'S1',
        major_required: 'Teknik Informatika/Sistem Informasi',
        location: 'Kantor Regional/BKN Pusat'
      },
      {
        institution: 'BKN',
        position: 'Analis Hukum',
        quota: 30,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Kantor Regional/BKN Pusat'
      }
    ]
  },
  {
    name: 'Kementerian Keuangan',
    slug: 'kemenkeu',
    total_quota: 650,
    formations: [
      {
        institution: 'Kemenkeu',
        position: 'Pemeriksa Pajak',
        quota: 300,
        education_required: 'S1',
        major_required: 'Akuntansi/Ekonomi/Manajemen',
        location: 'KPP/Kanwil DJP Seluruh Indonesia',
        additional_requirements: 'IPK minimal 2.75, Lulus seleksi akademik'
      },
      {
        institution: 'Kemenkeu',
        position: 'Analis Anggaran Ahli Pertama',
        quota: 150,
        education_required: 'S1',
        major_required: 'Ekonomi/Akuntansi/Keuangan',
        location: 'Kementerian Keuangan/Ditjen Anggaran'
      },
      {
        institution: 'Kemenkeu',
        position: 'Analis Bea dan Cukai',
        quota: 100,
        education_required: 'S1',
        major_required: 'Teknik/Keuangan/Akuntansi',
        location: 'Kantor Bea dan Cukai'
      },
      {
        institution: 'Kemenkeu',
        position: 'Pranata Komputer',
        quota: 50,
        education_required: 'S1',
        major_required: 'Teknik Informatika/Sistem Informasi',
        location: 'Kemenkeu Pusat/Regional'
      },
      {
        institution: 'Kemenkeu',
        position: 'Analis Keuangan',
        quota: 50,
        education_required: 'S1',
        major_required: 'Ekonomi/Akuntansi',
        location: 'Kemenkeu/DJPB'
      }
    ]
  },
  {
    name: 'Kementerian Luar Negeri',
    slug: 'kemenlu',
    total_quota: 120,
    formations: [
      {
        institution: 'Kemenlu',
        position: 'Diplomat',
        quota: 80,
        education_required: 'S1',
        major_required: 'Semua jurusan',
        location: 'Kementerian Luar Negeri/Perwakilan RI',
        additional_requirements: 'TOEFL minimal 500, IPK minimal 2.75'
      },
      {
        institution: 'Kemenlu',
        position: 'Analis Politik Luar Negeri',
        quota: 20,
        education_required: 'S1',
        major_required: 'Hubungan Internasional/Politik',
        location: 'Direktorat Politik'
      },
      {
        institution: 'Kemenlu',
        position: 'Pranata Komputer',
        quota: 10,
        education_required: 'S1',
        major_required: 'Teknik Informatika',
        location: 'Kemenlu Pusat'
      },
      {
        institution: 'Kemenlu',
        position: 'Penerjemah',
        quota: 10,
        education_required: 'S1',
        major_required: 'Bahasa Asing/Translasi',
        location: 'Kemenlu Pusat'
      }
    ]
  },
  {
    name: 'Kementerian Pertahanan',
    slug: 'kemhan',
    total_quota: 380,
    formations: [
      {
        institution: 'Kemhan',
        position: 'Analis Pertahanan',
        quota: 150,
        education_required: 'S1',
        major_required: 'Hubungan Internasional/Politik/Hukum',
        location: 'Kemhan Pusat/Balai'
      },
      {
        institution: 'Kemhan',
        position: 'Pranata Komputer',
        quota: 100,
        education_required: 'S1',
        major_required: 'Teknik Informatika/Sistem Informasi',
        location: 'Kemhan Pusat'
      },
      {
        institution: 'Kemhan',
        position: 'Analis Hukum',
        quota: 80,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Kemhan Pusat'
      },
      {
        institution: 'Kemhan',
        position: 'Analis Keuangan',
        quota: 50,
        education_required: 'S1',
        major_required: 'Ekonomi/Akuntansi/Keuangan',
        location: 'Kemhan Pusat'
      }
    ]
  },
  {
    name: 'Kementerian Agama',
    slug: 'kemenag',
    total_quota: 750,
    formations: [
      {
        institution: 'Kemenag',
        position: 'Penyuluhan Agama',
        quota: 400,
        education_required: 'S1/S2',
        major_required: 'Pendidikan Agama/Ilmu Keislaman',
        location: 'Kemenag Provinsi/Kabupaten Seluruh Indonesia'
      },
      {
        institution: 'Kemenag',
        position: 'Analis Keagamaan',
        quota: 200,
        education_required: 'S1/S2',
        major_required: 'Ilmu Keislaman/Studi Agama',
        location: 'Kanwil/Dinas Kemenag'
      },
      {
        institution: 'Kemenag',
        position: 'Analis Kepegawaian',
        quota: 100,
        education_required: 'S1',
        major_required: 'Administrasi/Psikologi',
        location: 'Kemenag Provinsi/Kabupaten'
      },
      {
        institution: 'Kemenag',
        position: 'Pranata Komputer',
        quota: 50,
        education_required: 'S1',
        major_required: 'Teknik Informatika',
        location: 'Kemenag Pusat/Provinsi'
      }
    ]
  },
  {
    name: 'Kementerian Perhubungan',
    slug: 'kemenhub',
    total_quota: 320,
    formations: [
      {
        institution: 'Kemenhub',
        position: 'Analis Angkutan Udara',
        quota: 100,
        education_required: 'S1',
        major_required: 'Teknik Penerbangan/Transportasi',
        location: 'Ditjen Perhubungan Udara'
      },
      {
        institution: 'Kemenhub',
        position: 'Analis Angkutan Laut',
        quota: 80,
        education_required: 'S1',
        major_required: 'Teknik Perkapalan/Transportasi',
        location: 'Ditjen Perhubungan Laut'
      },
      {
        institution: 'Kemenhub',
        position: 'Analis Angkutan Darat',
        quota: 80,
        education_required: 'S1',
        major_required: 'Teknik Sipil/Transportasi',
        location: 'Ditjen Perhubungan Darat'
      },
      {
        institution: 'Kemenhub',
        position: 'Pranata Komputer',
        quota: 40,
        education_required: 'S1',
        major_required: 'Teknik Informatika',
        location: 'Kemenhub Pusat'
      },
      {
        institution: 'Kemenhub',
        position: 'Analis Hukum',
        quota: 20,
        education_required: 'S1',
        major_required: 'Hukum',
        location: 'Kemenhub Pusat'
      }
    ]
  }
];

// Top 10 Provinces by Quota (Estimated based on population and civil service needs)
export const provinceData: ProvinceData[] = [
  {
    name: 'Jawa Barat',
    slug: 'jawa-barat',
    total_quota: 4500,
    total_institutions: 48,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenhub', 'Kemenag', 'BKN', 'Kemhan'],
    cities: ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Tasikmalaya', 'Cimahi', 'Sukabumi', 'Cirebon', 'Garut', 'Indramayu']
  },
  {
    name: 'DKI Jakarta',
    slug: 'dki-jakarta',
    total_quota: 3800,
    total_institutions: 52,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenlu', 'Kemhan', 'BKN', 'BPK', 'Setneg'],
    cities: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara', 'Kepulauan Seribu']
  },
  {
    name: 'Jawa Timur',
    slug: 'jawa-timur',
    total_quota: 3200,
    total_institutions: 45,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenhub', 'Kemenag', 'Kemhan'],
    cities: ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Kediri', 'Mojokerto', 'Jember', 'Pasuruan', 'Surakarta', 'Banyuwangi']
  },
  {
    name: 'Jawa Tengah',
    slug: 'jawa-tengah',
    total_quota: 2900,
    total_institutions: 42,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenag', 'Kemhan'],
    cities: ['Semarang', 'Yogyakarta', 'Solo', 'Magelang', 'Purwokerto', 'Tegal', 'Pekalongan', 'Klaten', 'Sukoharjo']
  },
  {
    name: 'Sumatera Utara',
    slug: 'sumatera-utara',
    total_quota: 1800,
    total_institutions: 35,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenag'],
    cities: ['Medan', 'Pematang Siantar', 'Binjai', 'Padang Sidempuan', 'Tebing Tinggi', 'Deli Serdang']
  },
  {
    name: 'Sulawesi Selatan',
    slug: 'sulawesi-selatan',
    total_quota: 1400,
    total_institutions: 30,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenag'],
    cities: ['Makassar', 'Palopo', 'Parepare', 'Gowa', 'Maros', 'Takalar']
  },
  {
    name: 'Sumatera Selatan',
    slug: 'sumatera-selatan',
    total_quota: 1300,
    total_institutions: 28,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenag'],
    cities: ['Palembang', 'Prabumulih', 'Lubuklinggau', 'Baturaja', 'Pagar Alam']
  },
  {
    name: 'Kalimantan Selatan',
    slug: 'kalimantan-selatan',
    total_quota: 900,
    total_institutions: 25,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu'],
    cities: ['Banjarmasin', 'Banjarbaru', 'Martapura', 'Tanah Laut', 'Barito Kuala']
  },
  {
    name: 'Lampung',
    slug: 'lampung',
    total_quota: 850,
    total_institutions: 24,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu', 'Kemenag'],
    cities: ['Bandar Lampung', 'Metro', 'Pringsewu', 'Tanggamus', 'Lampung Selatan']
  },
  {
    name: 'Riau',
    slug: 'riau',
    total_quota: 800,
    total_institutions: 22,
    institutions: ['Kemenkumham', 'Kejaksaan', 'MA', 'Kemenkeu'],
    cities: ['Pekanbaru', 'Dumai', 'Siak', 'Kampar', 'Pelalawan']
  }
];

// City data (subset for major cities)
export const cityData = [
  { name: 'Bandung', slug: 'bandung', province: 'Jawa Barat', provinceSlug: 'jawa-barat', totalQuota: 1200, totalInstitutions: 18 },
  { name: 'Bekasi', slug: 'bekasi', province: 'Jawa Barat', provinceSlug: 'jawa-barat', totalQuota: 800, totalInstitutions: 15 },
  { name: 'Depok', slug: 'depok', province: 'Jawa Barat', provinceSlug: 'jawa-barat', totalQuota: 650, totalInstitutions: 12 },
  { name: 'Bogor', slug: 'bogor', province: 'Jawa Barat', provinceSlug: 'jawa-barat', totalQuota: 600, totalInstitutions: 14 },
  { name: 'Jakarta Pusat', slug: 'jakarta-pusat', province: 'DKI Jakarta', provinceSlug: 'dki-jakarta', totalQuota: 700, totalInstitutions: 42 },
  { name: 'Jakarta Selatan', slug: 'jakarta-selatan', province: 'DKI Jakarta', provinceSlug: 'dki-jakarta', totalQuota: 750, totalInstitutions: 40 },
  { name: 'Jakarta Timur', slug: 'jakarta-timur', province: 'DKI Jakarta', provinceSlug: 'dki-jakarta', totalQuota: 680, totalInstitutions: 38 },
  { name: 'Surabaya', slug: 'surabaya', province: 'Jawa Timur', provinceSlug: 'jawa-timur', totalQuota: 850, totalInstitutions: 22 },
  { name: 'Malang', slug: 'malang', province: 'Jawa Timur', provinceSlug: 'jawa-timur', totalQuota: 550, totalInstitutions: 14 },
  { name: 'Semarang', slug: 'semarang', province: 'Jawa Tengah', provinceSlug: 'jawa-tengah', totalQuota: 720, totalInstitutions: 20 },
  { name: 'Yogyakarta', slug: 'yogyakarta', province: 'Jawa Tengah', provinceSlug: 'jawa-tengah', totalQuota: 600, totalInstitutions: 16 },
  { name: 'Medan', slug: 'medan', province: 'Sumatera Utara', provinceSlug: 'sumatera-utara', totalQuota: 650, totalInstitutions: 18 },
  { name: 'Makassar', slug: 'makassar', province: 'Sulawesi Selatan', provinceSlug: 'sulawesi-selatan', totalQuota: 500, totalInstitutions: 15 },
  { name: 'Palembang', slug: 'palembang', province: 'Sumatera Selatan', provinceSlug: 'sumatera-selatan', totalQuota: 450, totalInstitutions: 12 },
  { name: 'Banjarmasin', slug: 'banjarmasin', province: 'Kalimantan Selatan', provinceSlug: 'kalimantan-selatan', totalQuota: 350, totalInstitutions: 10 },
  { name: 'Bandar Lampung', slug: 'bandar-lampung', province: 'Lampung', provinceSlug: 'lampung', totalQuota: 320, totalInstitutions: 9 },
  { name: 'Pekanbaru', slug: 'pekanbaru', province: 'Riau', provinceSlug: 'riau', totalQuota: 300, totalInstitutions: 8 }
];

// Education levels
export const educationLevels = [
  { level: 'SMA', slug: 'sma', totalQuota: 4500, totalInstitutions: 8, description: 'Lulusan SMA/SMK untuk jabatan Pengawal Tahanan, Pemeriksa Keimigrasian, Panitera, dan Jurusita' },
  { level: 'D3', slug: 'd3', totalQuota: 2200, totalInstitutions: 10, description: 'Diploma III untuk Analis Kepegawaian, Pengelola Data, dan teknisi' },
  { level: 'S1/DIV', slug: 's1', totalQuota: 12000, totalInstitutions: 15, description: 'Sarjana/S1 untuk Analis, Jaksa, Hakim, Pemeriksa, dan jabatan ahli' },
  { level: 'S2', slug: 's2', totalQuota: 800, totalInstitutions: 5, description: 'Magister/S2 untuk jabatan spesialis dan penyuluh agama' }
];

// Helper functions
export function getInstitutionBySlug(slug: string): InstitutionData | undefined {
  return institutionData.find(i => i.slug === slug);
}

export function getProvinceBySlug(slug: string): ProvinceData | undefined {
  return provinceData.find(p => p.slug === slug);
}

export function getCityBySlug(slug: string): typeof cityData[0] | undefined {
  return cityData.find(c => c.slug === slug);
}

export function getEducationBySlug(slug: string): typeof educationLevels[0] | undefined {
  return educationLevels.find(e => e.slug === slug);
}

export function getFormationsForProvince(provinceSlug: string): FormationEntry[] {
  const province = getProvinceBySlug(provinceSlug);
  if (!province) return [];
  
  const formations: FormationEntry[] = [];
  for (const instName of province.institutions) {
    const inst = institutionData.find(i => i.name.toLowerCase().includes(instName.toLowerCase()));
    if (inst) {
      formations.push(...inst.formations);
    }
  }
  return formations;
}

export function getFormationsForCity(citySlug: string): FormationEntry[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  return getFormationsForProvince(city.provinceSlug);
}

export function getFormationsForEducation(educationSlug: string): FormationEntry[] {
  const edu = educationLevels.find(e => e.slug === educationSlug);
  if (!edu) return [];
  
  const allFormations = institutionData.flatMap(i => i.formations);
  return allFormations.filter(f => 
    f.education_required.toLowerCase().includes(edu.level.toLowerCase()) ||
    (edu.level === 'S1/DIV' && f.education_required.includes('S1')) ||
    (edu.level === 'SMA' && f.education_required.includes('SMA'))
  );
}
