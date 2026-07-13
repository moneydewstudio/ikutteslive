# TEAM_042: Analisis Fetch → Score → Simpan per Mode

## Ringkasan

Ada 3 mode soal: **Drill (latihan harian)**, **Daily Quiz**, **Tryout (simulasi SKD)**. Masing-masing beda cara fetch, beda cara skor, beda cara simpan ke DB. TKP punya scoring khusus (weighted). Semua hasil akhir dipakai untuk spider chart di `/analytics/subtopic-readiness`.

---

## 1. FETCH SOAL

### Drills (`/drills/daily`)
- **Endpoint:** GET `/drills/daily?category=TIU|TWK|TKP`
- **Alokasi:** 20 soal per category. Default pake rotasi harian (anchor 1 Apr 2026 → TIU, 2 Apr → TWK, 3 Apr → TKP). Premium user bisa pilih category via query param.
- **Seleksi:** `ORDER BY md5(id || dayKey)` → deterministic shuffle per hari.
- **Subject:** left JOIN `question_topics` → fallback ke string literal `category` jika subject null.
- **Frekuensi:** Boleh ambil berkali-kali per hari. Tidak ada submit ke server — hasil cuma lokal.

### Daily Quiz (`/quiz/daily`)
- **Endpoint:** GET `/quiz/daily`
- **Alokasi:** 5 soal: TWK=1, TIU=2, TKP=2.
- **Seleksi:** Sama deterministic shuffle per kategori.
- **Frekuensi:** 1× submit sukses per dayKey (client guard via localStorage `ikuttes_daily_quiz_submitted_day` + server guard via upsert on `(user_id, day_key)`).
- **Submit:** POST `/quiz/daily/submit` → simpan ke `daily_quiz_attempt_items`.

### Tryout (`/exam/start` → `/exam/:examId/questions` → `/exam/:examId/submit`)
- **Flow:**
  1. POST `/exam/start` — server generate JWT berisi `qids[]` + `endsAt`. Quota: TWK=30, TIU=35, TKP=45 (total 110 soal).
  2. GET `/exam/:examId/questions` — verify JWT, fetch soal berdasarkan `qids[]`.
  3. Submit → POST `/exam/:examId/submit`.
- **Keamanan:** Soal dikunci di JWT — tidak bisa ganti session. `correct_option_id` dikosongkan (`''`) saat fetch soal tryout (beda dengan drill/quiz yang dikirim langsung).

### Latihan Acak (`/questions/random`)
- Dipakai oleh mode QUIZ (bukan drill/daily/tryout). 5 soal random, ada filter category.
- Hasil tidak pernah dikirim ke server — lokal-only.

---

## 2. SCORING

### TWK & TIU — Correct Count
```
TWK: tiap jawaban benar = +1 poin. Passing = ≥13 benar (dari 30).
TIU: tiap jawaban benar = +1 poin. Passing = ≥16 benar (dari 35).
TKP: weighted scoring. Tiap soal punya 5 opsi dengan bobot 1-5.
     Jawaban user → ambil weight dari opsi terpilih. Akumulasi.
     Passing = ≥166 (dari max ~215 = 45 soal × max 5, tapi ada soal dengan max <5).
Total passing grade: TWK≥13 && TIU≥16 && TKP≥166 → total ≥300.
```

### Resolve Correct Option Key (`resolveCorrectOptionKey`)
```typescript
// Prioritas: isCorrect flag → weight tertinggi
const resolveCorrectOptionKey = (opts) => {
  const explicit = opts.find(o => o.isCorrect);
  if (explicit) return explicit.key;
  return opts.reduce((best, o) => o.weight > best.weight ? o : best).key;
};
```
- Jika ada `is_correct=true` → pakai itu.
- Jika TKP (tanpa `is_correct`, semua via weight) → ambil option dengan weight tertinggi sebagai `correct_option_id`.

### TKP Scoring Khusus
- `selectedWeight` = weight dari opsi dipilih user.
- `maxWeight` = weight tertinggi di antara 5 opsi.
- `ratioSum += selectedWeight / maxWeight` — dipakai di subtopic readiness.
- **Tidak ada field `is_correct`** di DB untuk TKP — null.

### Client-side Scoring (Drill/Quiz lokal)
```typescript
// quizService.ts:calculateResults
correctCount: sum(answers[q.id] === q.correct_option_id)
weightedScore: sum((100/totalQuestions) * (1 + (difficulty - 3) * 0.15))
readiness: min(weightedScore, 100)
```
- **Ini hanya visual client-side** — tidak disimpan ke server.
- Difficulty weighting: soal difficulty 3 → weight 1.0, difficulty 5 → weight 1.3.
- TKP di client: dibandingkan dengan `correct_option_id` (yang di-resolve sebagai option weight tertinggi). Tidak pakai gradasi weight seperti server.

---

## 3. SIMPAN HASIL KE DATABASE

### Tabel Tryout
```sql
tryout_attempts {
  id, user_id, total, twk, tiu, tkp, passed, created_at
}
tryout_attempt_items {
  id, attempt_id, question_id, category_code, subtopic_id,
  is_correct, selected_weight, max_weight
}
```
- **Trigger:** Submit tryout → insert `tryout_attempts` + batch insert `tryout_attempt_items`.
- **Cakupan:** Semua 110 soal.
- **Best-effort:** Gagal insert tidak batalin scoring — hanya log error.

### Tabel Daily Quiz
```sql
daily_quiz_attempts {
  id, user_id, day_key, created_at
}
daily_quiz_attempt_items {
  id, attempt_id, question_id, subtopic_id,
  is_correct, selected_weight, max_weight
}
```
- **Trigger:** POST `/quiz/daily/submit` → upsert by `(user_id, day_key)`.
- **Idempotent:** Replace items pada resubmit (DELETE + INSERT).
- **Cakupan:** 5 soal per hari.

### Drills
- **Tidak disimpan ke server.** Hasil cuma di localStorage.

### Latihan Acak
- **Tidak disimpan ke server.** Satu2nya data yang terkirim: event `/events/answer` (hitung `questions_answered_total` + `wrong_streak` untuk paywall trigger).

---

## 4. SPIDER CHART / SUBTOPIC READINESS

### Endpoint: `GET /analytics/subtopic-readiness`

```sql
-- Tryout items (via tryout_attempt_items JOIN tryout_attempts)
SELECT q.theme_id,
       count(*) as attempts,
       sum(case when is_correct then 1 else 0 end) as correct,
       sum(case when max_weight > 0
           then selected_weight::float / max_weight::float
           else 0 end) as ratio_sum
FROM tryout_attempt_items tai
JOIN tryout_attempts ta ON tai.attempt_id = ta.id
JOIN questions q ON tai.question_id = q.id
WHERE ta.user_id = $1 AND q.theme_id IS NOT NULL
GROUP BY q.theme_id

-- Daily quiz items (pola identik via daily_quiz_attempts)
SELECT q.theme_id, ...
FROM daily_quiz_attempt_items dai
JOIN daily_quiz_attempts da ON dai.attempt_id = da.id
JOIN questions q ON dai.question_id = q.id
WHERE da.user_id = $1 AND q.theme_id IS NOT NULL
GROUP BY q.theme_id
```

**Logic:**
1. Ambil semua `tryout_attempt_items` + `daily_quiz_attempt_items` per user, group by `questions.theme_id`.
2. TKP: `ratio = sum(selectedWeight / maxWeight) / attempts` (gradasi 0-1).
3. TWK/TIU: `ratio = correct / attempts` (binary benar/salah).
4. Gabung dengan `question_themes` untuk nama tema.
5. `value = max(0, min(100, ratio * 100))`.
6. **Drills tidak termasuk** — cuma tryout + daily quiz.

### Cache

Endpoint `/analytics/subtopic-readiness` pake `Cache-Control: no-store` + raw `neon()` template literal (bukan Drizzle ORM) karena [TEAM_037: Drizzle ORM builder silently returns 0 rows].

---

## 5. PERBEDAAN UTAMA

| Aspek | Drills | Daily Quiz | Tryout |
|-------|--------|------------|--------|
| **Soal/sesi** | 20 | 5 | 110 |
| **Pilih kategori** | Ya (rotasi/param) | Tidak (fixed quota) | Tidak (semua) |
| **Waktu** | Tidak ada | Tidak ada | 100 menit |
| **JWT token** | Tidak | Tidak | Ya (kunci soal + batas waktu) |
| **correct_option_id** | Dikirim | Dikirim | **Dikosongkan** |
| **Scoring server** | Tidak | Ya (sama persis dengan Tryout) | Ya |
| **Scoring TKP** | binary (client) | weighted (server) | weighted (server) |
| **Simpan ke DB** | ❌ | ✅ `daily_quiz_attempt_items` | ✅ `tryout_attempt_items` |
| **Masuk spider chart** | ❌ | ✅ | ✅ |
| **Frekuensi** | Unlimited/hari | 1×/hari | Unlimited (premium?) |

---

## 6. CATATAN ANOMALI / POTENSI BUG

1. **Drill tidak berkontribusi ke spider chart** — user drill banyak tapi data readiness-nya kosong.
2. **Scoring client vs server TKP tidak identik** — client pake `correct_option_id` (binary), server pake gradasi weight. Skor readiness di hasil drill bisa beda dengan hasil daily quiz untuk jawaban yang sama.
3. **Daily quiz `correct_option_id` dikirim ke client** — berbeda dengan Tryout yang dikosongkan. Konsistensi? Mungkin sengaja karena daily quiz hasilnya dikirim via submit (server re-scoring), jadi bocornya correct answer tidak masalah.
4. **Questions `theme_id` nullable** — soal tanpa theme_id tidak masuk perhitungan readiness. Wajib diisi di schema `questions_v2`.
