-- TEAM_010: seed sample programmatic pages for end-to-end verification (routing/SEO/sitemaps)

INSERT INTO programmatic_pages (
  id,
  hub,
  slug,
  keyword,
  intent,
  title,
  meta_description,
  h1,
  content_blocks,
  updated_at
)
VALUES
(
  'seed_tiu_analogi_001',
  'tiu',
  'tiu-analogi-verbal',
  'analogi verbal TIU CPNS',
  'practice',
  'Analogi Verbal TIU CPNS: Pola Cepat + Contoh',
  'Ringkasan analogi verbal TIU CPNS: pola hubungan kata, jebakan umum, dan cara latihan cepat sebelum Daily Quiz.',
  'Analogi Verbal TIU CPNS: pola cepat + contoh',
  (
    '[
      {"type":"paragraph","text":"Analogi verbal adalah tipe soal TIU yang menguji kemampuan kamu menemukan *hubungan* antara dua kata, lalu menerapkan pola yang sama ke pasangan kata berikutnya. Kuncinya bukan hafalan definisi, tapi mengenali bentuk relasi: sinonim, antonim, sebab-akibat, bagian-keseluruhan, fungsi, urutan, tingkat, dan lain-lain."},
      {"type":"paragraph","text":"Supaya akurat dan cepat, biasakan langkah yang konsisten: (1) Tentukan relasi A→B, (2) uji relasi itu dengan kalimat sederhana, (3) cocokkan relasi yang sama di pilihan jawaban. Jangan terpancing oleh kata yang mirip bunyi/tema; fokus pada relasi yang paling *spesifik* dan tidak mudah dipatahkan."},
      {"type":"heading","level":2,"text":"Pola relasi yang paling sering keluar"},
      {"type":"list","ordered":false,"items":["Sinonim/Padanan (mis. ‘cepat’ : ‘lekas’)","Antonim (mis. ‘panas’ : ‘dingin’)","Sebab → akibat (mis. ‘hujan’ : ‘banjir’)","Bagian → keseluruhan (mis. ‘kelopak’ : ‘bunga’)","Fungsi/alat → kegunaan (mis. ‘pisau’ : ‘memotong’)","Tingkat/derajat (mis. ‘baik’ : ‘sempurna’)" ]},
      {"type":"heading","level":2,"text":"Cara cepat menghindari jebakan"},
      {"type":"paragraph","text":"Jebakan paling umum adalah memilih opsi yang ‘terlihat masuk akal’ secara tema, tapi relasinya berbeda. Contoh: ‘dokter : rumah sakit’ bukan ‘tempat kerja’ saja, bisa juga ‘profesi : institusi’. Kalau kamu tidak menuliskan relasinya secara eksplisit, kamu mudah tertarik ke jawaban yang terlalu umum."},
      {"type":"paragraph","text":"Tips praktis: buat kalimat uji. Misalnya relasi A→B = ‘A digunakan untuk B’. Maka kalimatnya: ‘Pisau digunakan untuk memotong’. Kalau relasi kamu benar, kalimat uji untuk pasangan berikutnya juga harus sama kuatnya."},
      {"type":"question_preview","questionId":"TIU_ANALOGI_SEED_01"},
      {"type":"heading","level":2,"text":"Latihan mini (untuk pemanasan)"},
      {"type":"paragraph","text":"Coba bentuk relasi dari pasangan berikut, lalu cari jawaban yang relasinya identik: ‘BUNGA : NEKTAR’. Kamu bisa menulis 2–3 kandidat relasi, kemudian pilih yang paling spesifik. Ini melatih kamu berpikir terstruktur sebelum masuk ke paket soal yang lebih panjang."},
      {"type":"paragraph","text":"Q: Berapa lama sebaiknya latihan analogi per hari?"},
      {"type":"paragraph","text":"A: 10–15 menit konsisten lebih baik daripada 1 jam tapi jarang. Fokus pada pola relasi dan evaluasi salahnya di akhir sesi."}
    ]'::jsonb
  ),
  now()
),
(
  'seed_twk_pancasila_001',
  'twk',
  'twk-pancasila-sila-pertama',
  'makna sila pertama pancasila',
  'definition',
  'Makna Sila Pertama Pancasila: Inti, Implementasi, dan Contoh',
  'Makna sila pertama Pancasila “Ketuhanan Yang Maha Esa”: inti nilai, batasan, dan contoh implementasi yang sering jadi soal TWK.',
  'Makna Sila Pertama Pancasila: inti nilai dan contoh',
  (
    '[
      {"type":"paragraph","text":"Sila pertama Pancasila, ‘Ketuhanan Yang Maha Esa’, menjadi fondasi nilai ketuhanan dalam kehidupan berbangsa dan bernegara. Di soal TWK, yang diuji biasanya bukan sekadar bunyinya, tetapi bagaimana nilai itu diterapkan dalam prinsip toleransi, penghormatan terhadap keyakinan, dan penolakan pemaksaan agama."},
      {"type":"paragraph","text":"Cara memahami cepat: sila pertama menegaskan bahwa negara mengakui nilai ketuhanan, namun tetap memberi ruang hidup bersama bagi warga yang beragam. Maka, implementasinya selalu menekankan penghormatan, dialog, dan aturan yang adil — bukan dominasi satu kelompok atau tindakan yang melanggar hak dasar."},
      {"type":"heading","level":2,"text":"Inti makna sila pertama"},
      {"type":"list","ordered":false,"items":["Mengakui nilai ketuhanan sebagai dasar moral","Menjunjung kebebasan beragama/berkeyakinan","Menghormati perbedaan dan menolak pemaksaan","Mengutamakan toleransi dan kerukunan" ]},
      {"type":"heading","level":2,"text":"Contoh implementasi yang sering muncul di soal"},
      {"type":"paragraph","text":"Contoh yang tepat biasanya terkait sikap menghormati ibadah orang lain, tidak memprovokasi konflik SARA, dan mendukung kebijakan publik yang melindungi semua warga. Sebaliknya, tindakan yang memaksakan simbol/keyakinan, menghalangi ibadah, atau menyebar kebencian adalah contoh pelanggaran nilai sila pertama."},
      {"type":"heading","level":3,"text":"Cara menjawab soal TWK bertema sila pertama"},
      {"type":"paragraph","text":"Jika pilihan jawaban mirip, cari kata kunci seperti ‘memaksa’, ‘melarang’, ‘mengutamakan kelompok tertentu’ (biasanya salah) versus ‘menghormati’, ‘toleransi’, ‘kerukunan’, ‘memberi ruang’ (biasanya benar)."},
      {"type":"paragraph","text":"Q: Apakah sila pertama berarti negara harus mengikuti satu agama tertentu?"},
      {"type":"paragraph","text":"A: Tidak. Maknanya adalah pengakuan nilai ketuhanan dan jaminan kebebasan beragama, bukan penetapan satu agama sebagai identitas tunggal negara."}
    ]'::jsonb
  ),
  now()
)
ON CONFLICT (id) DO NOTHING;
