import { describe, expect, it } from 'vitest';
import { buildLessonSlides, buildSlideKey, resolveTheme, type MaterialTheme } from './roadmapSlides';

const theme = (over: Partial<MaterialTheme> = {}): MaterialTheme => ({
  name: 'Tema A', structuredContent: null, exampleQuestions: [], ...over,
});

describe('buildLessonSlides', () => {
  it('hook jadi lede content pertama, objectives dibuang, checkpoint disisip setelah content pertama', () => {
    const slides = buildLessonSlides(theme({
      structuredContent: { sections: [
        { type: 'hook', title: 'Hook', scenario: 'Cerita pembuka' },
        { type: 'learning_objectives', title: 'Tujuan', objectives: [{ label: 'Bisa X' }] },
        { type: 'content', title: 'Isi 1', body: 'Penjelasan 1' },
        { type: 'content', title: 'Isi 2', body: 'Penjelasan 2' },
        { type: 'checkpoint', title: 'Cek', question: 'Q?', feedback: 'Karena B',
          options: [{ key: 'A', text: 'salah' }, { key: 'B', text: 'benar', correct: true }] },
        { type: 'summary', title: 'Intisari', body: 'Ringkasan' },
      ] },
      exampleQuestions: [{ scenario: 'Soal 1', explanation: 'Karena X',
        options: [{ key: 'A', text: 'X', isCorrect: true }, { key: 'B', text: 'Y' }] }],
    }));

    expect(slides.map(s => s.kind)).toEqual(['content', 'quiz', 'content', 'quiz', 'completion']);

    const first = slides[0];
    expect(first.kind).toBe('content');
    if (first.kind !== 'content') throw new Error('unreachable');
    expect(first.lede).toBe('Cerita pembuka');
    expect(first.title).toBe('Isi 1');

    const ck = slides[1];
    expect(ck.kind).toBe('quiz');
    if (ck.kind !== 'quiz') throw new Error('unreachable');
    expect(ck.correctKey).toBe('B');
    expect(ck.explanation).toBe('Karena B');
    expect(ck.weighted).toBe(false);

    const ex = slides[3];
    expect(ex.kind).toBe('quiz');
    if (ex.kind !== 'quiz') throw new Error('unreachable');
    expect(ex.question).toBe('Soal 1');
    expect(ex.correctKey).toBe('A');

    const done = slides[4];
    expect(done.kind).toBe('completion');
    if (done.kind !== 'completion') throw new Error('unreachable');
    expect(done.summary).toBe('Ringkasan');
  });

  it('rotasi opsi checkpoint deterministik per nama tema', () => {
    const opts = [{ key: 'A', text: 'a' }, { key: 'B', text: 'b', correct: true }, { key: 'C', text: 'c' }];
    const sections: any = [{ type: 'checkpoint', title: 'Cek', question: 'Q?', options: opts }];
    const of = (name: string) => {
      const s = buildLessonSlides(theme({ name, structuredContent: { sections } }))[0];
      if (s.kind !== 'quiz') throw new Error('expected quiz');
      return s;
    };
    // stabil untuk nama yang sama
    expect(of('Tema A').options.map(o => o.key)).toEqual(of('Tema A').options.map(o => o.key));
    // kunci jawaban tetap benar setelah rotasi
    const q = of('Tema A');
    expect(q.options.find(o => o.correct)!.key).toBe(q.correctKey);
    // set opsi tidak hilang
    expect([...of('Tema A').options.map(o => o.key)].sort()).toEqual(['A', 'B', 'C']);
    // minimal satu nama menghasilkan urutan berbeda
    const names = ['Tema A', 'Tema B', 'Tema C', 'Pancasila', 'Integritas'];
    const orders = new Set(names.map(n => of(n).options.map(o => o.key).join('')));
    expect(orders.size).toBeGreaterThan(1);
  });

  it('quiz TKP ditandai weighted saat opsi punya weight', () => {
    const slides = buildLessonSlides(theme({
      exampleQuestions: [{ scenario: 'S', explanation: 'e', options: [
        { key: 'A', text: 'a', weight: 3 }, { key: 'B', text: 'b', weight: 5, isCorrect: true },
      ] }],
    }));
    const q = slides[0];
    expect(q.kind).toBe('quiz');
    if (q.kind !== 'quiz') throw new Error('unreachable');
    expect(q.weighted).toBe(true);
    expect(q.correctKey).toBe('B');
  });

  it('fallback: tema tanpa structuredContent jadi content + completion', () => {
    const slides = buildLessonSlides(theme({ name: 'Tema B' }));
    expect(slides.map(s => s.kind)).toEqual(['content', 'completion']);
    const first = slides[0];
    expect(first.kind).toBe('content');
    if (first.kind !== 'content') throw new Error('unreachable');
    expect(first.title).toBe('Tema B');
  });

  it('tema tanpa content section tetap dapat checkpoint + completion', () => {
    const slides = buildLessonSlides(theme({
      structuredContent: { sections: [
        { type: 'checkpoint', title: 'Cek', question: 'Q?', options: [{ key: 'A', text: 'a', correct: true }] },
      ] },
    }));
    expect(slides.map(s => s.kind)).toEqual(['quiz', 'completion']);
  });
});

describe('resolveTheme', () => {
  const themes = [theme({ name: 'Pancasila' }), theme({ name: 'UUD 1945' })];
  it('cocok berdasarkan name', () => {
    expect(resolveTheme(themes, 'UUD 1945')?.name).toBe('UUD 1945');
  });
  it('mengembalikan null saat tidak cocok — TIDAK jatuh ke tema pertama', () => {
    expect(resolveTheme(themes, 'Konstitusi & Hukum')).toBeNull();
    expect(resolveTheme(themes, null)).toBeNull();
  });
});

describe('buildSlideKey', () => {
  it('unik per tema+index', () => {
    expect(buildSlideKey('Tema A', 0)).toBe('Tema A:0');
    expect(buildSlideKey('Tema A', 1)).not.toBe(buildSlideKey('Tema A', 0));
  });
});
