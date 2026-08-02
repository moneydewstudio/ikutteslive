import { describe, it, expect } from 'vitest';
import { STATE, OptionState } from './OptionButton';

describe('OptionButton state tokens', () => {
  const states: OptionState[] = ['idle', 'selected', 'correct', 'wrong', 'weighted', 'weighted-best', 'dimmed'];

  it('maps every state to a class string', () => {
    for (const s of states) {
      expect(STATE[s]).toBeTruthy();
    }
  });

  it('uses feedback tokens, not raw hex, for correct/wrong', () => {
    expect(STATE.correct).toContain('bg-feedback-green');
    expect(STATE.correct).toContain('text-black');
    expect(STATE.wrong).toContain('bg-feedback-red');
    expect(STATE.wrong).toContain('text-black');
  });

  it('no state string contains a raw hex color', () => {
    for (const s of states) {
      expect(STATE[s]).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    }
  });
});
