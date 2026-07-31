export type SlideOption = { key: string; text: string; correct?: boolean; weight?: number };

export type LessonSlide =
  | { kind: 'content'; title: string; body: string; lede?: string }
  | { kind: 'quiz'; title: string; question: string; options: SlideOption[]; correctKey: string; explanation?: string; weighted: boolean }
  | { kind: 'completion'; title: string; summary?: string };

export type StructuredSection = {
  type: 'hook' | 'learning_objectives' | 'content' | 'checkpoint' | 'summary';
  title: string;
  body?: string;
  scenario?: string;
  objectives?: Array<{ label?: string; body?: string } | string>;
  question?: string;
  options?: SlideOption[];
  feedback?: string;
};

export type MaterialTheme = {
  name: string;
  code?: string;
  structuredContent: { estimatedMinutes?: number; sections: StructuredSection[] } | null;
  exampleQuestions?: Array<{
    scenario: string;
    options: Array<{ key: string; text: string; weight?: number; isCorrect?: boolean }>;
    explanation: string;
  }>;
};

export const buildSlideKey = (themeName: string, slideIndex: number) => `${themeName}:${slideIndex}`;

/**
 * Cocokkan tema roadmap (DB: {id, name}) ke tema materialJson lewat `name`.
 * Sengaja mengembalikan null saat tidak cocok — jangan pernah fallback ke themes[0],
 * itu membuka lesson yang salah tanpa error (lihat Task 0).
 */
export const resolveTheme = (themes: MaterialTheme[], name: string | null | undefined): MaterialTheme | null =>
  (name ? themes.find(t => t.name === name) : undefined) ?? null;

// Rotasi deterministik: semua checkpoint di silabus kunci jawabannya 'B' dengan
// hanya 3 set opsi yang dipakai ulang. Rotasi memutus pola tanpa mengubah data.
const rotate = <T,>(arr: T[], seed: string): T[] => {
  if (arr.length < 2) return arr;
  const n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
};

const pickCorrect = (opts: SlideOption[]) => opts.find(o => o.correct)?.key || opts[0]?.key || '';

export function buildLessonSlides(theme: MaterialTheme): LessonSlide[] {
  const sc = theme.structuredContent;
  const summary = sc?.sections.find(s => s.type === 'summary')?.body;
  const done: LessonSlide = { kind: 'completion', title: theme.name, summary };

  const exQuizzes: LessonSlide[] = (theme.exampleQuestions || []).map(ex => {
    const options = (ex.options || []).map(o => ({ key: o.key, text: o.text, correct: o.isCorrect, weight: o.weight }));
    return {
      kind: 'quiz', title: 'Contoh Soal', question: ex.scenario, options,
      correctKey: pickCorrect(options), explanation: ex.explanation,
      weighted: options.some(o => typeof o.weight === 'number'),
    };
  });

  if (!sc) {
    return [
      ...exQuizzes,
      { kind: 'content', title: theme.name, body: `Materi untuk **${theme.name}** sedang disusun.` },
      done,
    ];
  }

  const lede = sc.sections.find(s => s.type === 'hook')?.scenario;

  const contents: LessonSlide[] = sc.sections
    .filter(s => s.type === 'content')
    .map((s, i) => ({ kind: 'content' as const, title: s.title, body: s.body || '', ...(i === 0 && lede ? { lede } : {}) }));

  const checkpoints: LessonSlide[] = sc.sections
    .filter(s => s.type === 'checkpoint')
    .map(s => {
      const options = rotate(s.options || [], theme.name);
      return {
        kind: 'quiz' as const, title: s.title, question: s.question || '', options,
        correctKey: pickCorrect(options), explanation: s.feedback,
        weighted: options.some(o => typeof o.weight === 'number'),
      };
    });

  // Checkpoint pertama disisipkan setelah content pertama supaya interaksi datang
  // di tap 2, bukan tap 4-6. Sisanya menyusul setelah seluruh content.
  const [firstCk, ...restCk] = checkpoints;
  const head = contents.length && firstCk ? [contents[0], firstCk, ...contents.slice(1)]
    : contents.length ? contents
    : firstCk ? [firstCk] : [];

  return [...head, ...restCk, ...exQuizzes, done];
}
