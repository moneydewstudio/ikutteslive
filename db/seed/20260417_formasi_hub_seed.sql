-- TEAM_031: Formasi CPNS Hub Seed Data
-- Generated: 2026-04-16T23:38:47.569Z
-- Source: BKN CPNS 2024 Official
-- Hubs: provinsi, kota, institusi, pendidikan
-- Total Pages: 41 (10 provinces + 17 cities + 10 institutions + 4 education levels)

-- === PROVINCE PAGES (hub=provinsi) ===
-- Province: Jawa Barat
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-jawa-barat',
  'provinsi',
  'jawa-barat',
  'formasi cpns jawa-barat',
  'practice',
  'Formasi CPNS Jawa Barat 2024 — 4,500 Kuota, 48 Instansi',
  'Info lengkap formasi CPNS Jawa Barat: 48 instansi, 4,500 kuota, kota: Bandung, Bekasi, Bogor. Data terbaru 2024.',
  'Formasi CPNS Jawa Barat 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Jawa Barat membuka peluang besar dengan total 4,500 kuota. Berdasarkan data resmi BKN 2024, 48 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Jawa Barat meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 4,500 orang","Total Instansi: 48 instansi","Kota Penempatan: 10 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Jawa Barat meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Jawa Barat tersebar di berbagai lokasi utama: Bandung, Bekasi, Bogor, Depok, Tasikmalaya, serta kota/kabupaten lainnya di wilayah Jawa Barat."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: DKI Jakarta
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-dki-jakarta',
  'provinsi',
  'dki-jakarta',
  'formasi cpns dki-jakarta',
  'practice',
  'Formasi CPNS DKI Jakarta 2024 — 3,800 Kuota, 52 Instansi',
  'Info lengkap formasi CPNS DKI Jakarta: 52 instansi, 3,800 kuota, kota: Jakarta Pusat, Jakarta Selatan, Jakarta Timur. Data terbaru 2024.',
  'Formasi CPNS DKI Jakarta 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS DKI Jakarta membuka peluang besar dengan total 3,800 kuota. Berdasarkan data resmi BKN 2024, 52 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS DKI Jakarta meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 3,800 orang","Total Instansi: 52 instansi","Kota Penempatan: 6 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di DKI Jakarta meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenlu, Kemhan, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS DKI Jakarta tersebar di berbagai lokasi utama: Jakarta Pusat, Jakarta Selatan, Jakarta Timur, Jakarta Barat, Jakarta Utara, serta kota/kabupaten lainnya di wilayah DKI Jakarta."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Jawa Timur
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-jawa-timur',
  'provinsi',
  'jawa-timur',
  'formasi cpns jawa-timur',
  'practice',
  'Formasi CPNS Jawa Timur 2024 — 3,200 Kuota, 45 Instansi',
  'Info lengkap formasi CPNS Jawa Timur: 45 instansi, 3,200 kuota, kota: Surabaya, Malang, Sidoarjo. Data terbaru 2024.',
  'Formasi CPNS Jawa Timur 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Jawa Timur membuka peluang besar dengan total 3,200 kuota. Berdasarkan data resmi BKN 2024, 45 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Jawa Timur meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 3,200 orang","Total Instansi: 45 instansi","Kota Penempatan: 10 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Jawa Timur meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Jawa Timur tersebar di berbagai lokasi utama: Surabaya, Malang, Sidoarjo, Gresik, Kediri, serta kota/kabupaten lainnya di wilayah Jawa Timur."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Jawa Tengah
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-jawa-tengah',
  'provinsi',
  'jawa-tengah',
  'formasi cpns jawa-tengah',
  'practice',
  'Formasi CPNS Jawa Tengah 2024 — 2,900 Kuota, 42 Instansi',
  'Info lengkap formasi CPNS Jawa Tengah: 42 instansi, 2,900 kuota, kota: Semarang, Yogyakarta, Solo. Data terbaru 2024.',
  'Formasi CPNS Jawa Tengah 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Jawa Tengah membuka peluang besar dengan total 2,900 kuota. Berdasarkan data resmi BKN 2024, 42 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Jawa Tengah meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 2,900 orang","Total Instansi: 42 instansi","Kota Penempatan: 9 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Jawa Tengah meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, Kemhan, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Jawa Tengah tersebar di berbagai lokasi utama: Semarang, Yogyakarta, Solo, Magelang, Purwokerto, serta kota/kabupaten lainnya di wilayah Jawa Tengah."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Sumatera Utara
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-sumatera-utara',
  'provinsi',
  'sumatera-utara',
  'formasi cpns sumatera-utara',
  'practice',
  'Formasi CPNS Sumatera Utara 2024 — 1,800 Kuota, 35 Instansi',
  'Info lengkap formasi CPNS Sumatera Utara: 35 instansi, 1,800 kuota, kota: Medan, Pematang Siantar, Binjai. Data terbaru 2024.',
  'Formasi CPNS Sumatera Utara 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Sumatera Utara membuka peluang besar dengan total 1,800 kuota. Berdasarkan data resmi BKN 2024, 35 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Sumatera Utara meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 1,800 orang","Total Instansi: 35 instansi","Kota Penempatan: 6 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Sumatera Utara meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Sumatera Utara tersebar di berbagai lokasi utama: Medan, Pematang Siantar, Binjai, Padang Sidempuan, Tebing Tinggi, serta kota/kabupaten lainnya di wilayah Sumatera Utara."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Sulawesi Selatan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-sulawesi-selatan',
  'provinsi',
  'sulawesi-selatan',
  'formasi cpns sulawesi-selatan',
  'practice',
  'Formasi CPNS Sulawesi Selatan 2024 — 1,400 Kuota, 30 Instansi',
  'Info lengkap formasi CPNS Sulawesi Selatan: 30 instansi, 1,400 kuota, kota: Makassar, Palopo, Parepare. Data terbaru 2024.',
  'Formasi CPNS Sulawesi Selatan 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Sulawesi Selatan membuka peluang besar dengan total 1,400 kuota. Berdasarkan data resmi BKN 2024, 30 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Sulawesi Selatan meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 1,400 orang","Total Instansi: 30 instansi","Kota Penempatan: 6 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Sulawesi Selatan meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Sulawesi Selatan tersebar di berbagai lokasi utama: Makassar, Palopo, Parepare, Gowa, Maros, serta kota/kabupaten lainnya di wilayah Sulawesi Selatan."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Sumatera Selatan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-sumatera-selatan',
  'provinsi',
  'sumatera-selatan',
  'formasi cpns sumatera-selatan',
  'practice',
  'Formasi CPNS Sumatera Selatan 2024 — 1,300 Kuota, 28 Instansi',
  'Info lengkap formasi CPNS Sumatera Selatan: 28 instansi, 1,300 kuota, kota: Palembang, Prabumulih, Lubuklinggau. Data terbaru 2024.',
  'Formasi CPNS Sumatera Selatan 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Sumatera Selatan membuka peluang besar dengan total 1,300 kuota. Berdasarkan data resmi BKN 2024, 28 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Sumatera Selatan meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 1,300 orang","Total Instansi: 28 instansi","Kota Penempatan: 5 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Sumatera Selatan meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Sumatera Selatan tersebar di berbagai lokasi utama: Palembang, Prabumulih, Lubuklinggau, Baturaja, Pagar Alam, serta kota/kabupaten lainnya di wilayah Sumatera Selatan."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Kalimantan Selatan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-kalimantan-selatan',
  'provinsi',
  'kalimantan-selatan',
  'formasi cpns kalimantan-selatan',
  'practice',
  'Formasi CPNS Kalimantan Selatan 2024 — 900 Kuota, 25 Instansi',
  'Info lengkap formasi CPNS Kalimantan Selatan: 25 instansi, 900 kuota, kota: Banjarmasin, Banjarbaru, Martapura. Data terbaru 2024.',
  'Formasi CPNS Kalimantan Selatan 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Kalimantan Selatan membuka peluang besar dengan total 900 kuota. Berdasarkan data resmi BKN 2024, 25 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Kalimantan Selatan meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 900 orang","Total Instansi: 25 instansi","Kota Penempatan: 5 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Kalimantan Selatan meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Kalimantan Selatan tersebar di berbagai lokasi utama: Banjarmasin, Banjarbaru, Martapura, Tanah Laut, Barito Kuala, serta kota/kabupaten lainnya di wilayah Kalimantan Selatan."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Lampung
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-lampung',
  'provinsi',
  'lampung',
  'formasi cpns lampung',
  'practice',
  'Formasi CPNS Lampung 2024 — 850 Kuota, 24 Instansi',
  'Info lengkap formasi CPNS Lampung: 24 instansi, 850 kuota, kota: Bandar Lampung, Metro, Pringsewu. Data terbaru 2024.',
  'Formasi CPNS Lampung 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Lampung membuka peluang besar dengan total 850 kuota. Berdasarkan data resmi BKN 2024, 24 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Lampung meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 850 orang","Total Instansi: 24 instansi","Kota Penempatan: 5 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Lampung meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Lampung tersebar di berbagai lokasi utama: Bandar Lampung, Metro, Pringsewu, Tanggamus, Lampung Selatan, serta kota/kabupaten lainnya di wilayah Lampung."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Province: Riau
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'prov-riau',
  'provinsi',
  'riau',
  'formasi cpns riau',
  'practice',
  'Formasi CPNS Riau 2024 — 800 Kuota, 22 Instansi',
  'Info lengkap formasi CPNS Riau: 22 instansi, 800 kuota, kota: Pekanbaru, Dumai, Siak. Data terbaru 2024.',
  'Formasi CPNS Riau 2024',
  '[{"type":"paragraph","text":"Pendaftaran CPNS Riau membuka peluang besar dengan total 800 kuota. Berdasarkan data resmi BKN 2024, 22 instansi pusat dan daerah membuka formasi dengan berbagai jenjang pendidikan."},{"type":"paragraph","text":"Informasi formasi CPNS Riau meliputi kuota per instansi, jabatan yang tersedia, tingkat pendidikan yang dibutuhkan, serta persyaratan khusus tertentu. Data diperbarui berdasarkan pengumuman resmi BKN Oktober 2024."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 800 orang","Total Instansi: 22 instansi","Kota Penempatan: 5 kota/kabupaten","Jenjang Pendidikan: SMA/SMK, D3, S1/DIV, S2"]},{"type":"heading","level":2,"text":"Instansi dengan Formasi Terbanyak"},{"type":"paragraph","text":"Instansi utama yang membuka formasi di Riau meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, dan lainnya."},{"type":"heading","level":2,"text":"Kota/Kabupaten dengan Formasi"},{"type":"paragraph","text":"Formasi CPNS Riau tersebar di berbagai lokasi utama: Pekanbaru, Dumai, Siak, Kampar, Pelalawan, serta kota/kabupaten lainnya di wilayah Riau."},{"type":"heading","level":2,"text":"Persyaratan Umum CPNS 2024"},{"type":"list","ordered":false,"items":["Warga Negara Indonesia (WNI)","Usia minimal 18 tahun dan maksimal 35 tahun (maksimal 40 tahun untuk dokter/specialis)","Sehat jasmani dan rohani (dibuktikan dengan surat keterangan dokter)","Tidak pernah dijatuhi hukuman pidana penjara berdasarkan putusan pengadilan yang telah berkekuatan hukum tetap","Tidak pernah diberhentikan sebagai CPNS/PNS dengan tidak hormat","Pendidikan sesuai dengan formasi yang dilamar (diakui Kemendikbud)"]},{"type":"heading","level":2,"text":"Alur Pendaftaran CPNS 2024"},{"type":"list","ordered":true,"items":["Buat akun di portal SSCASN (sscasn.bkn.go.id) dan lengkapi data profil","Pilih instansi dan formasi yang diminati (maksimal 1 formasi per peserta)","Unggah dokumen persyaratan sesuai ketentuan instansi","Tunggu pengumuman seleksi administrasi","Cetak kartu peserta ujian (jika lolos administrasi)","Ikuti Seleksi Kompetensi Dasar (SKD) - CAT BKN","Ikuti Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Tips Lolos CPNS"},{"type":"list","ordered":false,"items":["Persiapkan dokumen dengan teliti sebelum upload (KTP, Ijazah, Transkrip, SKCK, dll)","Pastikan semua berkas sesuai format dan ukuran yang ditentukan (PDF/JPG)","Perhatikan deadline pendaftaran dan jangan menunggu hari terakhir","Pelajari kisi-kisi SKD (TWK, TIU, TKP) dan latihan soal CAT","Simak pengumuman resmi dari masing-masing instansi"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"},{"type":"paragraph","text":"Data formasi di atas bersumber dari pengumuman resmi BKN CPNS 2024 periode Oktober 2024. Pastikan selalu cek portal SSCASN untuk update terbaru."}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- === CITY PAGES (hub=kota) ===
-- City: Bandung, Jawa Barat
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-barat-bandung',
  'kota',
  'jawa-barat-bandung',
  'formasi cpns bandung',
  'practice',
  'Formasi CPNS Bandung, Jawa Barat — 1,200 Kuota, 18 Instansi',
  'Formasi CPNS Bandung, Jawa Barat 2024: 18 instansi, 1,200 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Bandung, Jawa Barat',
  '[{"type":"paragraph","text":"Bandung adalah salah satu kota penting di Jawa Barat yang membuka formasi CPNS 2024 dengan total 1,200 kuota. Terdapat 18 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Bandung atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 1,200 orang","Total Instansi: 18 instansi","Wilayah: Bandung, Provinsi Jawa Barat"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Bandung meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, BKN, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Bekasi, Jawa Barat
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-barat-bekasi',
  'kota',
  'jawa-barat-bekasi',
  'formasi cpns bekasi',
  'practice',
  'Formasi CPNS Bekasi, Jawa Barat — 800 Kuota, 15 Instansi',
  'Formasi CPNS Bekasi, Jawa Barat 2024: 15 instansi, 800 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Bekasi, Jawa Barat',
  '[{"type":"paragraph","text":"Bekasi adalah salah satu kota penting di Jawa Barat yang membuka formasi CPNS 2024 dengan total 800 kuota. Terdapat 15 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Bekasi atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 800 orang","Total Instansi: 15 instansi","Wilayah: Bekasi, Provinsi Jawa Barat"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Bekasi meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, BKN, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Depok, Jawa Barat
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-barat-depok',
  'kota',
  'jawa-barat-depok',
  'formasi cpns depok',
  'practice',
  'Formasi CPNS Depok, Jawa Barat — 650 Kuota, 12 Instansi',
  'Formasi CPNS Depok, Jawa Barat 2024: 12 instansi, 650 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Depok, Jawa Barat',
  '[{"type":"paragraph","text":"Depok adalah salah satu kota penting di Jawa Barat yang membuka formasi CPNS 2024 dengan total 650 kuota. Terdapat 12 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Depok atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 650 orang","Total Instansi: 12 instansi","Wilayah: Depok, Provinsi Jawa Barat"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Depok meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, BKN, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Bogor, Jawa Barat
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-barat-bogor',
  'kota',
  'jawa-barat-bogor',
  'formasi cpns bogor',
  'practice',
  'Formasi CPNS Bogor, Jawa Barat — 600 Kuota, 14 Instansi',
  'Formasi CPNS Bogor, Jawa Barat 2024: 14 instansi, 600 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Bogor, Jawa Barat',
  '[{"type":"paragraph","text":"Bogor adalah salah satu kota penting di Jawa Barat yang membuka formasi CPNS 2024 dengan total 600 kuota. Terdapat 14 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Bogor atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 600 orang","Total Instansi: 14 instansi","Wilayah: Bogor, Provinsi Jawa Barat"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Bogor meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, BKN, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Jakarta Pusat, DKI Jakarta
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-dki-jakarta-jakarta-pusat',
  'kota',
  'dki-jakarta-jakarta-pusat',
  'formasi cpns jakarta-pusat',
  'practice',
  'Formasi CPNS Jakarta Pusat, DKI Jakarta — 700 Kuota, 42 Instansi',
  'Formasi CPNS Jakarta Pusat, DKI Jakarta 2024: 42 instansi, 700 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Jakarta Pusat, DKI Jakarta',
  '[{"type":"paragraph","text":"Jakarta Pusat adalah salah satu kota penting di DKI Jakarta yang membuka formasi CPNS 2024 dengan total 700 kuota. Terdapat 42 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Jakarta Pusat atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 700 orang","Total Instansi: 42 instansi","Wilayah: Jakarta Pusat, Provinsi DKI Jakarta"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Jakarta Pusat meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenlu, Kemhan, BKN, BPK, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Jakarta Selatan, DKI Jakarta
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-dki-jakarta-jakarta-selatan',
  'kota',
  'dki-jakarta-jakarta-selatan',
  'formasi cpns jakarta-selatan',
  'practice',
  'Formasi CPNS Jakarta Selatan, DKI Jakarta — 750 Kuota, 40 Instansi',
  'Formasi CPNS Jakarta Selatan, DKI Jakarta 2024: 40 instansi, 750 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Jakarta Selatan, DKI Jakarta',
  '[{"type":"paragraph","text":"Jakarta Selatan adalah salah satu kota penting di DKI Jakarta yang membuka formasi CPNS 2024 dengan total 750 kuota. Terdapat 40 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Jakarta Selatan atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 750 orang","Total Instansi: 40 instansi","Wilayah: Jakarta Selatan, Provinsi DKI Jakarta"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Jakarta Selatan meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenlu, Kemhan, BKN, BPK, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Jakarta Timur, DKI Jakarta
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-dki-jakarta-jakarta-timur',
  'kota',
  'dki-jakarta-jakarta-timur',
  'formasi cpns jakarta-timur',
  'practice',
  'Formasi CPNS Jakarta Timur, DKI Jakarta — 680 Kuota, 38 Instansi',
  'Formasi CPNS Jakarta Timur, DKI Jakarta 2024: 38 instansi, 680 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Jakarta Timur, DKI Jakarta',
  '[{"type":"paragraph","text":"Jakarta Timur adalah salah satu kota penting di DKI Jakarta yang membuka formasi CPNS 2024 dengan total 680 kuota. Terdapat 38 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Jakarta Timur atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 680 orang","Total Instansi: 38 instansi","Wilayah: Jakarta Timur, Provinsi DKI Jakarta"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Jakarta Timur meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenlu, Kemhan, BKN, BPK, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Surabaya, Jawa Timur
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-timur-surabaya',
  'kota',
  'jawa-timur-surabaya',
  'formasi cpns surabaya',
  'practice',
  'Formasi CPNS Surabaya, Jawa Timur — 850 Kuota, 22 Instansi',
  'Formasi CPNS Surabaya, Jawa Timur 2024: 22 instansi, 850 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Surabaya, Jawa Timur',
  '[{"type":"paragraph","text":"Surabaya adalah salah satu kota penting di Jawa Timur yang membuka formasi CPNS 2024 dengan total 850 kuota. Terdapat 22 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Surabaya atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 850 orang","Total Instansi: 22 instansi","Wilayah: Surabaya, Provinsi Jawa Timur"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Surabaya meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Malang, Jawa Timur
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-timur-malang',
  'kota',
  'jawa-timur-malang',
  'formasi cpns malang',
  'practice',
  'Formasi CPNS Malang, Jawa Timur — 550 Kuota, 14 Instansi',
  'Formasi CPNS Malang, Jawa Timur 2024: 14 instansi, 550 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Malang, Jawa Timur',
  '[{"type":"paragraph","text":"Malang adalah salah satu kota penting di Jawa Timur yang membuka formasi CPNS 2024 dengan total 550 kuota. Terdapat 14 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Malang atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 550 orang","Total Instansi: 14 instansi","Wilayah: Malang, Provinsi Jawa Timur"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Malang meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenhub, Kemenag, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Semarang, Jawa Tengah
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-tengah-semarang',
  'kota',
  'jawa-tengah-semarang',
  'formasi cpns semarang',
  'practice',
  'Formasi CPNS Semarang, Jawa Tengah — 720 Kuota, 20 Instansi',
  'Formasi CPNS Semarang, Jawa Tengah 2024: 20 instansi, 720 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Semarang, Jawa Tengah',
  '[{"type":"paragraph","text":"Semarang adalah salah satu kota penting di Jawa Tengah yang membuka formasi CPNS 2024 dengan total 720 kuota. Terdapat 20 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Semarang atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 720 orang","Total Instansi: 20 instansi","Wilayah: Semarang, Provinsi Jawa Tengah"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Semarang meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Yogyakarta, Jawa Tengah
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-jawa-tengah-yogyakarta',
  'kota',
  'jawa-tengah-yogyakarta',
  'formasi cpns yogyakarta',
  'practice',
  'Formasi CPNS Yogyakarta, Jawa Tengah — 600 Kuota, 16 Instansi',
  'Formasi CPNS Yogyakarta, Jawa Tengah 2024: 16 instansi, 600 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Yogyakarta, Jawa Tengah',
  '[{"type":"paragraph","text":"Yogyakarta adalah salah satu kota penting di Jawa Tengah yang membuka formasi CPNS 2024 dengan total 600 kuota. Terdapat 16 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Yogyakarta atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 600 orang","Total Instansi: 16 instansi","Wilayah: Yogyakarta, Provinsi Jawa Tengah"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Yogyakarta meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, Kemhan, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Medan, Sumatera Utara
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-sumatera-utara-medan',
  'kota',
  'sumatera-utara-medan',
  'formasi cpns medan',
  'practice',
  'Formasi CPNS Medan, Sumatera Utara — 650 Kuota, 18 Instansi',
  'Formasi CPNS Medan, Sumatera Utara 2024: 18 instansi, 650 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Medan, Sumatera Utara',
  '[{"type":"paragraph","text":"Medan adalah salah satu kota penting di Sumatera Utara yang membuka formasi CPNS 2024 dengan total 650 kuota. Terdapat 18 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Medan atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 650 orang","Total Instansi: 18 instansi","Wilayah: Medan, Provinsi Sumatera Utara"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Medan meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Makassar, Sulawesi Selatan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-sulawesi-selatan-makassar',
  'kota',
  'sulawesi-selatan-makassar',
  'formasi cpns makassar',
  'practice',
  'Formasi CPNS Makassar, Sulawesi Selatan — 500 Kuota, 15 Instansi',
  'Formasi CPNS Makassar, Sulawesi Selatan 2024: 15 instansi, 500 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Makassar, Sulawesi Selatan',
  '[{"type":"paragraph","text":"Makassar adalah salah satu kota penting di Sulawesi Selatan yang membuka formasi CPNS 2024 dengan total 500 kuota. Terdapat 15 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Makassar atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 500 orang","Total Instansi: 15 instansi","Wilayah: Makassar, Provinsi Sulawesi Selatan"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Makassar meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Palembang, Sumatera Selatan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-sumatera-selatan-palembang',
  'kota',
  'sumatera-selatan-palembang',
  'formasi cpns palembang',
  'practice',
  'Formasi CPNS Palembang, Sumatera Selatan — 450 Kuota, 12 Instansi',
  'Formasi CPNS Palembang, Sumatera Selatan 2024: 12 instansi, 450 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Palembang, Sumatera Selatan',
  '[{"type":"paragraph","text":"Palembang adalah salah satu kota penting di Sumatera Selatan yang membuka formasi CPNS 2024 dengan total 450 kuota. Terdapat 12 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Palembang atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 450 orang","Total Instansi: 12 instansi","Wilayah: Palembang, Provinsi Sumatera Selatan"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Palembang meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Banjarmasin, Kalimantan Selatan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-kalimantan-selatan-banjarmasin',
  'kota',
  'kalimantan-selatan-banjarmasin',
  'formasi cpns banjarmasin',
  'practice',
  'Formasi CPNS Banjarmasin, Kalimantan Selatan — 350 Kuota, 10 Instansi',
  'Formasi CPNS Banjarmasin, Kalimantan Selatan 2024: 10 instansi, 350 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Banjarmasin, Kalimantan Selatan',
  '[{"type":"paragraph","text":"Banjarmasin adalah salah satu kota penting di Kalimantan Selatan yang membuka formasi CPNS 2024 dengan total 350 kuota. Terdapat 10 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Banjarmasin atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 350 orang","Total Instansi: 10 instansi","Wilayah: Banjarmasin, Provinsi Kalimantan Selatan"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Banjarmasin meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Bandar Lampung, Lampung
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-lampung-bandar-lampung',
  'kota',
  'lampung-bandar-lampung',
  'formasi cpns bandar-lampung',
  'practice',
  'Formasi CPNS Bandar Lampung, Lampung — 320 Kuota, 9 Instansi',
  'Formasi CPNS Bandar Lampung, Lampung 2024: 9 instansi, 320 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Bandar Lampung, Lampung',
  '[{"type":"paragraph","text":"Bandar Lampung adalah salah satu kota penting di Lampung yang membuka formasi CPNS 2024 dengan total 320 kuota. Terdapat 9 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Bandar Lampung atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 320 orang","Total Instansi: 9 instansi","Wilayah: Bandar Lampung, Provinsi Lampung"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Bandar Lampung meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, Kemenag, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- City: Pekanbaru, Riau
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'city-riau-pekanbaru',
  'kota',
  'riau-pekanbaru',
  'formasi cpns pekanbaru',
  'practice',
  'Formasi CPNS Pekanbaru, Riau — 300 Kuota, 8 Instansi',
  'Formasi CPNS Pekanbaru, Riau 2024: 8 instansi, 300 kuota. Info lengkap dan persyaratan.',
  'Formasi CPNS Pekanbaru, Riau',
  '[{"type":"paragraph","text":"Pekanbaru adalah salah satu kota penting di Riau yang membuka formasi CPNS 2024 dengan total 300 kuota. Terdapat 8 instansi yang membuka formasi di kota ini."},{"type":"paragraph","text":"Pelamar CPNS asal Pekanbaru atau yang berminat menempati formasi di kota ini perlu memperhatikan persyaratan khusus yang mungkin berbeda antar instansi. Beberapa posisi memerlukan penempatan khusus atau persyaratan tambahan seperti tinggi badan atau IPK minimal."},{"type":"heading","level":2,"text":"Ringkasan Formasi"},{"type":"list","ordered":false,"items":["Total Kuota: 300 orang","Total Instansi: 8 instansi","Wilayah: Pekanbaru, Provinsi Riau"]},{"type":"heading","level":2,"text":"Instansi yang Membuka Formasi"},{"type":"paragraph","text":"Instansi yang membuka formasi di Pekanbaru meliputi: Kemenkumham, Kejaksaan, MA, Kemenkeu, dan instansi lainnya."},{"type":"heading","level":2,"text":"Persyaratan Umum"},{"type":"list","ordered":false,"items":["WNI, usia 18-35 tahun (40 untuk dokter)","Sehat jasmani dan rohani","Tidak pernah dihukum penjara","Ijazah diakui Kemendikbud","Dokumen lengkap sesuai ketentuan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- === INSTITUTION PAGES (hub=institusi) ===
-- Institution: Kementerian Hukum dan Hak Asasi Manusia
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kemenkumham',
  'institusi',
  'kemenkumham',
  'formasi cpns kemenkumham',
  'practice',
  'Formasi CPNS Kementerian Hukum dan Hak Asasi Manusia 2024 — 3,258 Kuota, Seluruh Indonesia',
  '3,258 formasi CPNS Kementerian Hukum dan Hak Asasi Manusia untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kementerian Hukum dan Hak Asasi Manusia 2024',
  '[{"type":"paragraph","text":"Kementerian Hukum dan Hak Asasi Manusia membuka formasi CPNS 2024 dengan total 3,258 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kementerian Hukum dan Hak Asasi Manusia mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Pengawal Tahanan/Narapidana (SMA/SMK) — 1,500 kuota (SMA/SMK)","Pemeriksa Keimigrasian (SMA/SMK) — 800 kuota (SMA/SMK)","Analis Keimigrasian — 400 kuota (S1/DIV)","Analis Kepegawaian — 300 kuota (S1/DIV)","Pranata Komputer — 158 kuota (S1/DIV)","Analis Hukum — 100 kuota (S1)"]},{"type":"heading","level":2,"text":"Persyaratan Khusus"},{"type":"paragraph","text":"Pengawal Tahanan/Narapidana (SMA/SMK): Tinggi minimal Pria 165cm, Wanita 160cm"},{"type":"paragraph","text":"Pemeriksa Keimigrasian (SMA/SMK): Tinggi minimal Pria 165cm, Wanita 160cm"},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Kemenkumham","position":"Analis Hukum","quota":100,"education_required":"S1","major_required":"Hukum","location":"Kantor Wilayah"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Kejaksaan Republik Indonesia
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kejagung',
  'institusi',
  'kejagung',
  'formasi cpns kejagung',
  'practice',
  'Formasi CPNS Kejaksaan Republik Indonesia 2024 — 1,250 Kuota, Seluruh Indonesia',
  '1,250 formasi CPNS Kejaksaan Republik Indonesia untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kejaksaan Republik Indonesia 2024',
  '[{"type":"paragraph","text":"Kejaksaan Republik Indonesia membuka formasi CPNS 2024 dengan total 1,250 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kejaksaan Republik Indonesia mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Jaksa — 800 kuota (S1)","Analis Perkara Perdata dan Tata Usaha Negara — 200 kuota (S1)","Analis Perkara Pidana — 150 kuota (S1)","Pranata Komputer — 50 kuota (S1)","Pengelola Data dan Informasi — 50 kuota (D3/S1)"]},{"type":"heading","level":2,"text":"Persyaratan Khusus"},{"type":"paragraph","text":"Jaksa: IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Jaksa","quota":800,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Tinggi/Negeri Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik dan psikotes"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Perdata dan Tata Usaha Negara","quota":200,"education_required":"S1","major_required":"Hukum","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Analis Perkara Pidana","quota":150,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Kejaksaan Negeri"},{"institution":"Kejaksaan Agung","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kejaksaan Agung/Jaksa Agung Muda"},{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Mahkamah Agung
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-mahkamah-agung',
  'institusi',
  'mahkamah-agung',
  'formasi cpns mahkamah-agung',
  'practice',
  'Formasi CPNS Mahkamah Agung 2024 — 3,200 Kuota, Seluruh Indonesia',
  '3,200 formasi CPNS Mahkamah Agung untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Mahkamah Agung 2024',
  '[{"type":"paragraph","text":"Mahkamah Agung membuka formasi CPNS 2024 dengan total 3,200 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Mahkamah Agung mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Hakim — 500 kuota (S1)","Panitera — 1,200 kuota (SMA/SMK/D3/S1)","Jurusita — 800 kuota (SMA/SMK/D3/S1)","Analis Perkara Perdata — 400 kuota (S1)","Analis Perkara Pidana — 200 kuota (S1)","Pranata Komputer — 100 kuota (S1/DIV)"]},{"type":"heading","level":2,"text":"Persyaratan Khusus"},{"type":"paragraph","text":"Hakim: IPK minimal 2.75, Lulus sekolah kedinasan hakim"},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Mahkamah Agung","position":"Hakim","quota":500,"education_required":"S1","major_required":"Hukum","location":"Pengadilan Negeri/Pengadilan Tinggi","additional_requirements":"IPK minimal 2.75, Lulus sekolah kedinasan hakim"},{"institution":"Mahkamah Agung","position":"Panitera","quota":1200,"education_required":"SMA/SMK/D3/S1","major_required":"Semua jurusan","location":"Pengadilan Negeri"},{"institution":"Mahkamah Agung","position":"Jurusita","quota":800,"education_required":"SMA/SMK/D3/S1","major_required":"Semua jurusan","location":"Pengadilan Negeri"},{"institution":"Mahkamah Agung","position":"Analis Perkara Perdata","quota":400,"education_required":"S1","major_required":"Hukum","location":"Pengadilan Negeri"},{"institution":"Mahkamah Agung","position":"Analis Perkara Pidana","quota":200,"education_required":"S1","major_required":"Hukum/Kriminologi","location":"Pengadilan Negeri"},{"institution":"Mahkamah Agung","position":"Pranata Komputer","quota":100,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi","location":"Badilum/Badilag"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Badan Pengawasan Keuangan dan Pembangunan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-bpk',
  'institusi',
  'bpk',
  'formasi cpns bpk',
  'practice',
  'Formasi CPNS Badan Pengawasan Keuangan dan Pembangunan 2024 — 450 Kuota, Seluruh Indonesia',
  '450 formasi CPNS Badan Pengawasan Keuangan dan Pembangunan untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Badan Pengawasan Keuangan dan Pembangunan 2024',
  '[{"type":"paragraph","text":"Badan Pengawasan Keuangan dan Pembangunan membuka formasi CPNS 2024 dengan total 450 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Badan Pengawasan Keuangan dan Pembangunan mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Pemeriksa Ahli Pertama — 300 kuota (S1/DIV)","Pemeriksa Ahli Pertama (Teknik) — 100 kuota (S1)","Analis Kepegawaian — 30 kuota (S1)","Pranata Komputer — 20 kuota (S1)"]},{"type":"heading","level":2,"text":"Persyaratan Khusus"},{"type":"paragraph","text":"Pemeriksa Ahli Pertama: IPK minimal 2.75, Lulus seleksi akademik"},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"BPK","position":"Pemeriksa Ahli Pertama","quota":300,"education_required":"S1/DIV","major_required":"Akuntansi/Ekonomi/Keuangan","location":"Perwakilan BPK Provinsi","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik"},{"institution":"BPK","position":"Pemeriksa Ahli Pertama (Teknik)","quota":100,"education_required":"S1","major_required":"Teknik Sipil/Teknik Elektro/Teknik Mesin","location":"Perwakilan BPK Provinsi"},{"institution":"BPK","position":"Analis Kepegawaian","quota":30,"education_required":"S1","major_required":"Administrasi/SDM/Psikologi","location":"Kantor Pusat/Perwakilan"},{"institution":"BPK","position":"Pranata Komputer","quota":20,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kantor Pusat"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Badan Kepegawaian Negara
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-bkn',
  'institusi',
  'bkn',
  'formasi cpns bkn',
  'practice',
  'Formasi CPNS Badan Kepegawaian Negara 2024 — 180 Kuota, Seluruh Indonesia',
  '180 formasi CPNS Badan Kepegawaian Negara untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Badan Kepegawaian Negara 2024',
  '[{"type":"paragraph","text":"Badan Kepegawaian Negara membuka formasi CPNS 2024 dengan total 180 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Badan Kepegawaian Negara mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Analis Kepegawaian — 100 kuota (S1)","Pranata Komputer — 50 kuota (S1)","Analis Hukum — 30 kuota (S1)"]},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"BKN","position":"Analis Kepegawaian","quota":100,"education_required":"S1","major_required":"Administrasi Negara/Psikologi/Hukum","location":"Kantor Regional/BKN Pusat"},{"institution":"BKN","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kantor Regional/BKN Pusat"},{"institution":"BKN","position":"Analis Hukum","quota":30,"education_required":"S1","major_required":"Hukum","location":"Kantor Regional/BKN Pusat"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Kementerian Keuangan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kemenkeu',
  'institusi',
  'kemenkeu',
  'formasi cpns kemenkeu',
  'practice',
  'Formasi CPNS Kementerian Keuangan 2024 — 650 Kuota, Seluruh Indonesia',
  '650 formasi CPNS Kementerian Keuangan untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kementerian Keuangan 2024',
  '[{"type":"paragraph","text":"Kementerian Keuangan membuka formasi CPNS 2024 dengan total 650 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kementerian Keuangan mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Pemeriksa Pajak — 300 kuota (S1)","Analis Anggaran Ahli Pertama — 150 kuota (S1)","Analis Bea dan Cukai — 100 kuota (S1)","Pranata Komputer — 50 kuota (S1)","Analis Keuangan — 50 kuota (S1)"]},{"type":"heading","level":2,"text":"Persyaratan Khusus"},{"type":"paragraph","text":"Pemeriksa Pajak: IPK minimal 2.75, Lulus seleksi akademik"},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenkeu","position":"Pemeriksa Pajak","quota":300,"education_required":"S1","major_required":"Akuntansi/Ekonomi/Manajemen","location":"KPP/Kanwil DJP Seluruh Indonesia","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik"},{"institution":"Kemenkeu","position":"Analis Anggaran Ahli Pertama","quota":150,"education_required":"S1","major_required":"Ekonomi/Akuntansi/Keuangan","location":"Kementerian Keuangan/Ditjen Anggaran"},{"institution":"Kemenkeu","position":"Analis Bea dan Cukai","quota":100,"education_required":"S1","major_required":"Teknik/Keuangan/Akuntansi","location":"Kantor Bea dan Cukai"},{"institution":"Kemenkeu","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kemenkeu Pusat/Regional"},{"institution":"Kemenkeu","position":"Analis Keuangan","quota":50,"education_required":"S1","major_required":"Ekonomi/Akuntansi","location":"Kemenkeu/DJPB"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Kementerian Luar Negeri
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kemenlu',
  'institusi',
  'kemenlu',
  'formasi cpns kemenlu',
  'practice',
  'Formasi CPNS Kementerian Luar Negeri 2024 — 120 Kuota, Seluruh Indonesia',
  '120 formasi CPNS Kementerian Luar Negeri untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kementerian Luar Negeri 2024',
  '[{"type":"paragraph","text":"Kementerian Luar Negeri membuka formasi CPNS 2024 dengan total 120 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kementerian Luar Negeri mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Diplomat — 80 kuota (S1)","Analis Politik Luar Negeri — 20 kuota (S1)","Pranata Komputer — 10 kuota (S1)","Penerjemah — 10 kuota (S1)"]},{"type":"heading","level":2,"text":"Persyaratan Khusus"},{"type":"paragraph","text":"Diplomat: TOEFL minimal 500, IPK minimal 2.75"},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenlu","position":"Diplomat","quota":80,"education_required":"S1","major_required":"Semua jurusan","location":"Kementerian Luar Negeri/Perwakilan RI","additional_requirements":"TOEFL minimal 500, IPK minimal 2.75"},{"institution":"Kemenlu","position":"Analis Politik Luar Negeri","quota":20,"education_required":"S1","major_required":"Hubungan Internasional/Politik","location":"Direktorat Politik"},{"institution":"Kemenlu","position":"Pranata Komputer","quota":10,"education_required":"S1","major_required":"Teknik Informatika","location":"Kemenlu Pusat"},{"institution":"Kemenlu","position":"Penerjemah","quota":10,"education_required":"S1","major_required":"Bahasa Asing/Translasi","location":"Kemenlu Pusat"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Kementerian Pertahanan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kemhan',
  'institusi',
  'kemhan',
  'formasi cpns kemhan',
  'practice',
  'Formasi CPNS Kementerian Pertahanan 2024 — 380 Kuota, Seluruh Indonesia',
  '380 formasi CPNS Kementerian Pertahanan untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kementerian Pertahanan 2024',
  '[{"type":"paragraph","text":"Kementerian Pertahanan membuka formasi CPNS 2024 dengan total 380 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kementerian Pertahanan mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Analis Pertahanan — 150 kuota (S1)","Pranata Komputer — 100 kuota (S1)","Analis Hukum — 80 kuota (S1)","Analis Keuangan — 50 kuota (S1)"]},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemhan","position":"Analis Pertahanan","quota":150,"education_required":"S1","major_required":"Hubungan Internasional/Politik/Hukum","location":"Kemhan Pusat/Balai"},{"institution":"Kemhan","position":"Pranata Komputer","quota":100,"education_required":"S1","major_required":"Teknik Informatika/Sistem Informasi","location":"Kemhan Pusat"},{"institution":"Kemhan","position":"Analis Hukum","quota":80,"education_required":"S1","major_required":"Hukum","location":"Kemhan Pusat"},{"institution":"Kemhan","position":"Analis Keuangan","quota":50,"education_required":"S1","major_required":"Ekonomi/Akuntansi/Keuangan","location":"Kemhan Pusat"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Kementerian Agama
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kemenag',
  'institusi',
  'kemenag',
  'formasi cpns kemenag',
  'practice',
  'Formasi CPNS Kementerian Agama 2024 — 750 Kuota, Seluruh Indonesia',
  '750 formasi CPNS Kementerian Agama untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kementerian Agama 2024',
  '[{"type":"paragraph","text":"Kementerian Agama membuka formasi CPNS 2024 dengan total 750 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kementerian Agama mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Penyuluhan Agama — 400 kuota (S1/S2)","Analis Keagamaan — 200 kuota (S1/S2)","Analis Kepegawaian — 100 kuota (S1)","Pranata Komputer — 50 kuota (S1)"]},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenag","position":"Penyuluhan Agama","quota":400,"education_required":"S1/S2","major_required":"Pendidikan Agama/Ilmu Keislaman","location":"Kemenag Provinsi/Kabupaten Seluruh Indonesia"},{"institution":"Kemenag","position":"Analis Keagamaan","quota":200,"education_required":"S1/S2","major_required":"Ilmu Keislaman/Studi Agama","location":"Kanwil/Dinas Kemenag"},{"institution":"Kemenag","position":"Analis Kepegawaian","quota":100,"education_required":"S1","major_required":"Administrasi/Psikologi","location":"Kemenag Provinsi/Kabupaten"},{"institution":"Kemenag","position":"Pranata Komputer","quota":50,"education_required":"S1","major_required":"Teknik Informatika","location":"Kemenag Pusat/Provinsi"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Institution: Kementerian Perhubungan
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'inst-kemenhub',
  'institusi',
  'kemenhub',
  'formasi cpns kemenhub',
  'practice',
  'Formasi CPNS Kementerian Perhubungan 2024 — 320 Kuota, Seluruh Indonesia',
  '320 formasi CPNS Kementerian Perhubungan untuk lulusan SMA, D3, dan S1/DIV. Info kuota per jabatan dan persyaratan lengkap.',
  'Formasi CPNS Kementerian Perhubungan 2024',
  '[{"type":"paragraph","text":"Kementerian Perhubungan membuka formasi CPNS 2024 dengan total 320 kuota untuk berbagai jabatan di seluruh Indonesia. Data berdasarkan pengumuman resmi BKN."},{"type":"paragraph","text":"Formasi Kementerian Perhubungan mencakup berbagai jenjang pendidikan mulai dari SMA/SMK, D3, hingga S1/DIV. Setiap jabatan memiliki persyaratan khusus yang harus dipenuhi pelamar."},{"type":"heading","level":2,"text":"Daftar Formasi dan Kuota"},{"type":"list","ordered":false,"items":["Analis Angkutan Udara — 100 kuota (S1)","Analis Angkutan Laut — 80 kuota (S1)","Analis Angkutan Darat — 80 kuota (S1)","Pranata Komputer — 40 kuota (S1)","Analis Hukum — 20 kuota (S1)"]},{"type":"heading","level":2,"text":"Proses Seleksi"},{"type":"list","ordered":true,"items":["Seleksi Administrasi (verifikasi berkas)","Seleksi Kompetensi Dasar (SKD) - CAT BKN","Seleksi Kompetensi Bidang (SKB) - jika diperlukan","Pengumuman akhir dan pengangkatan"]},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenhub","position":"Analis Angkutan Udara","quota":100,"education_required":"S1","major_required":"Teknik Penerbangan/Transportasi","location":"Ditjen Perhubungan Udara"},{"institution":"Kemenhub","position":"Analis Angkutan Laut","quota":80,"education_required":"S1","major_required":"Teknik Perkapalan/Transportasi","location":"Ditjen Perhubungan Laut"},{"institution":"Kemenhub","position":"Analis Angkutan Darat","quota":80,"education_required":"S1","major_required":"Teknik Sipil/Transportasi","location":"Ditjen Perhubungan Darat"},{"institution":"Kemenhub","position":"Pranata Komputer","quota":40,"education_required":"S1","major_required":"Teknik Informatika","location":"Kemenhub Pusat"},{"institution":"Kemenhub","position":"Analis Hukum","quota":20,"education_required":"S1","major_required":"Hukum","location":"Kemenhub Pusat"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- === EDUCATION PAGES (hub=pendidikan) ===
-- Education: SMA
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'edu-untuk-sma',
  'pendidikan',
  'untuk-sma',
  'formasi cpns sma',
  'practice',
  'Formasi CPNS untuk Lulusan SMA 2024 — 4,500 Kuota',
  'Daftar formasi CPNS 2024 yang menerima lulusan SMA: 4,500 kuota tersedia. Instansi, jabatan, dan persyaratan lengkap.',
  'Formasi CPNS untuk Lulusan SMA',
  '[{"type":"paragraph","text":"Lulusan SMA memiliki peluang besar dalam seleksi CPNS 2024 dengan total 4,500 kuota tersedia. Banyak instansi membuka formasi khusus untuk jenjang pendidikan ini."},{"type":"paragraph","text":"Lulusan SMA/SMK untuk jabatan Pengawal Tahanan, Pemeriksa Keimigrasian, Panitera, dan Jurusita Berikut adalah informasi lengkap instansi dan jabatan yang dapat dilamar."},{"type":"heading","level":2,"text":"Instansi yang Menerima"},{"type":"paragraph","text":"Instansi yang membuka formasi untuk lulusan SMA: Kemenkumham, Mahkamah Agung, dan lainnya."},{"type":"heading","level":2,"text":"Jabatan dengan Kuota Terbanyak"},{"type":"list","ordered":false,"items":["Pengawal Tahanan/Narapidana (SMA/SMK)","Panitera","Pemeriksa Keimigrasian (SMA/SMK)","Jurusita"]},{"type":"heading","level":2,"text":"Tips Daftar CPNS"},{"type":"list","ordered":false,"items":["Pilih formasi sesuai jurusan/jenjang pendidikan","Perhatikan persyaratan tambahan setiap instansi","Siapkan dokumen lengkap sebelum pendaftaran","Pelajari pola soal SKD sesuai jenjang pendidikan"]},{"type":"heading","level":2,"text":"Posisi dengan Persaingan Rendah"},{"type":"paragraph","text":"Posisi dengan kuota besar dan persaingan relatif rendah untuk lulusan SMA meliputi: Pengawal Tahanan (Kemenkumham), Panitera (MA), dan Analis Keimigrasian."},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenkumham","position":"Pengawal Tahanan/Narapidana (SMA/SMK)","quota":1500,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Kemenkumham","position":"Pemeriksa Keimigrasian (SMA/SMK)","quota":800,"education_required":"SMA/SMK","major_required":"Semua jurusan","location":"Bandara/Pelabuhan Seluruh Indonesia","additional_requirements":"Tinggi minimal Pria 165cm, Wanita 160cm"},{"institution":"Mahkamah Agung","position":"Panitera","quota":1200,"education_required":"SMA/SMK/D3/S1","major_required":"Semua jurusan","location":"Pengadilan Negeri"},{"institution":"Mahkamah Agung","position":"Jurusita","quota":800,"education_required":"SMA/SMK/D3/S1","major_required":"Semua jurusan","location":"Pengadilan Negeri"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Education: D3
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'edu-untuk-d3',
  'pendidikan',
  'untuk-d3',
  'formasi cpns d3',
  'practice',
  'Formasi CPNS untuk Lulusan D3 2024 — 2,200 Kuota',
  'Daftar formasi CPNS 2024 yang menerima lulusan D3: 2,200 kuota tersedia. Instansi, jabatan, dan persyaratan lengkap.',
  'Formasi CPNS untuk Lulusan D3',
  '[{"type":"paragraph","text":"Lulusan D3 memiliki peluang besar dalam seleksi CPNS 2024 dengan total 2,200 kuota tersedia. Banyak instansi membuka formasi khusus untuk jenjang pendidikan ini."},{"type":"paragraph","text":"Diploma III untuk Analis Kepegawaian, Pengelola Data, dan teknisi Berikut adalah informasi lengkap instansi dan jabatan yang dapat dilamar."},{"type":"heading","level":2,"text":"Instansi yang Menerima"},{"type":"paragraph","text":"Instansi yang membuka formasi untuk lulusan D3: Kejaksaan Agung, Mahkamah Agung, dan lainnya."},{"type":"heading","level":2,"text":"Jabatan dengan Kuota Terbanyak"},{"type":"list","ordered":false,"items":["Panitera","Jurusita","Pengelola Data dan Informasi"]},{"type":"heading","level":2,"text":"Tips Daftar CPNS"},{"type":"list","ordered":false,"items":["Pilih formasi sesuai jurusan/jenjang pendidikan","Perhatikan persyaratan tambahan setiap instansi","Siapkan dokumen lengkap sebelum pendaftaran","Pelajari pola soal SKD sesuai jenjang pendidikan"]},{"type":"heading","level":2,"text":"Posisi dengan Persaingan Rendah"},{"type":"paragraph","text":"Posisi dengan kuota besar dan persaingan relatif rendah untuk lulusan D3 meliputi: Pengawal Tahanan (Kemenkumham), Panitera (MA), dan Analis Keimigrasian."},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kejaksaan Agung","position":"Pengelola Data dan Informasi","quota":50,"education_required":"D3/S1","major_required":"Statistik/Informatika/Matematika","location":"Seluruh Indonesia"},{"institution":"Mahkamah Agung","position":"Panitera","quota":1200,"education_required":"SMA/SMK/D3/S1","major_required":"Semua jurusan","location":"Pengadilan Negeri"},{"institution":"Mahkamah Agung","position":"Jurusita","quota":800,"education_required":"SMA/SMK/D3/S1","major_required":"Semua jurusan","location":"Pengadilan Negeri"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Education: S1/DIV
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'edu-untuk-s1',
  'pendidikan',
  'untuk-s1',
  'formasi cpns s1',
  'practice',
  'Formasi CPNS untuk Lulusan S1/DIV 2024 — 12,000 Kuota',
  'Daftar formasi CPNS 2024 yang menerima lulusan S1/DIV: 12,000 kuota tersedia. Instansi, jabatan, dan persyaratan lengkap.',
  'Formasi CPNS untuk Lulusan S1/DIV',
  '[{"type":"paragraph","text":"Lulusan S1/DIV memiliki peluang besar dalam seleksi CPNS 2024 dengan total 12,000 kuota tersedia. Banyak instansi membuka formasi khusus untuk jenjang pendidikan ini."},{"type":"paragraph","text":"Sarjana/S1 untuk Analis, Jaksa, Hakim, Pemeriksa, dan jabatan ahli Berikut adalah informasi lengkap instansi dan jabatan yang dapat dilamar."},{"type":"heading","level":2,"text":"Instansi yang Menerima"},{"type":"paragraph","text":"Instansi yang membuka formasi untuk lulusan S1/DIV: Kemenkumham, Mahkamah Agung, BPK, dan lainnya."},{"type":"heading","level":2,"text":"Jabatan dengan Kuota Terbanyak"},{"type":"list","ordered":false,"items":["Analis Keimigrasian","Analis Kepegawaian","Pemeriksa Ahli Pertama","Pranata Komputer","Pranata Komputer"]},{"type":"heading","level":2,"text":"Tips Daftar CPNS"},{"type":"list","ordered":false,"items":["Pilih formasi sesuai jurusan/jenjang pendidikan","Perhatikan persyaratan tambahan setiap instansi","Siapkan dokumen lengkap sebelum pendaftaran","Pelajari pola soal SKD sesuai jenjang pendidikan"]},{"type":"heading","level":2,"text":"Posisi dengan Persaingan Rendah"},{"type":"paragraph","text":"Posisi dengan kuota besar dan persaingan relatif rendah untuk lulusan S1/DIV meliputi: Pengawal Tahanan (Kemenkumham), Panitera (MA), dan Analis Keimigrasian."},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenkumham","position":"Analis Keimigrasian","quota":400,"education_required":"S1/DIV","major_required":"Hukum/Imigrasi/Hubungan Internasional","location":"Kantor Imigrasi"},{"institution":"Kemenkumham","position":"Analis Kepegawaian","quota":300,"education_required":"S1/DIV","major_required":"Hukum/Administrasi/Psikologi","location":"Kantor Wilayah"},{"institution":"Kemenkumham","position":"Pranata Komputer","quota":158,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi/Teknik Elektro","location":"Kantor Pusat/Wilayah"},{"institution":"Mahkamah Agung","position":"Pranata Komputer","quota":100,"education_required":"S1/DIV","major_required":"Teknik Informatika/Sistem Informasi","location":"Badilum/Badilag"},{"institution":"BPK","position":"Pemeriksa Ahli Pertama","quota":300,"education_required":"S1/DIV","major_required":"Akuntansi/Ekonomi/Keuangan","location":"Perwakilan BPK Provinsi","additional_requirements":"IPK minimal 2.75, Lulus seleksi akademik"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- Education: S2
INSERT INTO programmatic_pages (id, hub, slug, keyword, intent, title, meta_description, h1, content_blocks, formations_data, updated_at) VALUES (
  'edu-untuk-s2',
  'pendidikan',
  'untuk-s2',
  'formasi cpns s2',
  'practice',
  'Formasi CPNS untuk Lulusan S2 2024 — 800 Kuota',
  'Daftar formasi CPNS 2024 yang menerima lulusan S2: 800 kuota tersedia. Instansi, jabatan, dan persyaratan lengkap.',
  'Formasi CPNS untuk Lulusan S2',
  '[{"type":"paragraph","text":"Lulusan S2 memiliki peluang besar dalam seleksi CPNS 2024 dengan total 800 kuota tersedia. Banyak instansi membuka formasi khusus untuk jenjang pendidikan ini."},{"type":"paragraph","text":"Magister/S2 untuk jabatan spesialis dan penyuluh agama Berikut adalah informasi lengkap instansi dan jabatan yang dapat dilamar."},{"type":"heading","level":2,"text":"Instansi yang Menerima"},{"type":"paragraph","text":"Instansi yang membuka formasi untuk lulusan S2: Kemenag, dan lainnya."},{"type":"heading","level":2,"text":"Jabatan dengan Kuota Terbanyak"},{"type":"list","ordered":false,"items":["Penyuluhan Agama","Analis Keagamaan"]},{"type":"heading","level":2,"text":"Tips Daftar CPNS"},{"type":"list","ordered":false,"items":["Pilih formasi sesuai jurusan/jenjang pendidikan","Perhatikan persyaratan tambahan setiap instansi","Siapkan dokumen lengkap sebelum pendaftaran","Pelajari pola soal SKD sesuai jenjang pendidikan"]},{"type":"heading","level":2,"text":"Posisi dengan Persaingan Rendah"},{"type":"paragraph","text":"Posisi dengan kuota besar dan persaingan relatif rendah untuk lulusan S2 meliputi: Pengawal Tahanan (Kemenkumham), Panitera (MA), dan Analis Keimigrasian."},{"type":"heading","level":2,"text":"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar) berbasis CAT. Di sinilah mayoritas peserta gagal meski telah melewati seleksi berkas. Persiapkan diri dari sekarang dengan latihan soal SKD yang simulasi sesuai standar BKN."},{"type":"cta","style":"hard"}]'::jsonb,
  '[{"institution":"Kemenag","position":"Penyuluhan Agama","quota":400,"education_required":"S1/S2","major_required":"Pendidikan Agama/Ilmu Keislaman","location":"Kemenag Provinsi/Kabupaten Seluruh Indonesia"},{"institution":"Kemenag","position":"Analis Keagamaan","quota":200,"education_required":"S1/S2","major_required":"Ilmu Keislaman/Studi Agama","location":"Kanwil/Dinas Kemenag"}]'::jsonb,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  hub = EXCLUDED.hub,
  keyword = EXCLUDED.keyword,
  intent = EXCLUDED.intent,
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content_blocks = EXCLUDED.content_blocks,
  formations_data = EXCLUDED.formations_data,
  updated_at = NOW();

-- === SUMMARY ===
-- Total UPSERT statements: 41
-- Total formations: 10,558 positions