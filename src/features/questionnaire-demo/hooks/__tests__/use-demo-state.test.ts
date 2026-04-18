import { describe, expect, it } from 'vitest';

import {
  hasAnswer,
  updateAnswers,
  type DemoAnswers,
} from '@features/questionnaire-demo/hooks/use-demo-state';

const EMPTY: DemoAnswers = { skinType: null, concerns: [], ageRange: null };

describe('hasAnswer', () => {
  it('returns false on step 0 with no skinType', () => {
    expect(hasAnswer(0, EMPTY)).toBe(false);
  });

  it('returns true on step 0 when skinType is set', () => {
    expect(hasAnswer(0, { ...EMPTY, skinType: 'dry' })).toBe(true);
  });

  it('returns false on step 1 with empty concerns', () => {
    expect(hasAnswer(1, EMPTY)).toBe(false);
  });

  it('returns true on step 1 when concerns has entries', () => {
    expect(hasAnswer(1, { ...EMPTY, concerns: ['imperfections'] })).toBe(true);
  });

  it('returns false on step 2 with no ageRange', () => {
    expect(hasAnswer(2, EMPTY)).toBe(false);
  });

  it('returns true on step 2 when ageRange is set', () => {
    expect(hasAnswer(2, { ...EMPTY, ageRange: '20-29' })).toBe(true);
  });

  it('returns false on step 3 (completion)', () => {
    const full: DemoAnswers = { skinType: 'dry', concerns: ['glow'], ageRange: '20-29' };
    expect(hasAnswer(3, full)).toBe(false);
  });
});

describe('updateAnswers – step 0 (single-choice skinType)', () => {
  it('sets skinType', () => {
    const result = updateAnswers(0, 'oily', EMPTY);
    expect(result.skinType).toBe('oily');
  });

  it('overwrites existing skinType', () => {
    const prev = { ...EMPTY, skinType: 'dry' };
    expect(updateAnswers(0, 'oily', prev).skinType).toBe('oily');
  });
});

describe('updateAnswers – step 1 (multi-choice concerns)', () => {
  it('adds a concern when not present', () => {
    const result = updateAnswers(1, 'wrinkles', EMPTY);
    expect(result.concerns).toEqual(['wrinkles']);
  });

  it('removes a concern when already selected (toggle)', () => {
    const prev = { ...EMPTY, concerns: ['wrinkles', 'glow'] };
    const result = updateAnswers(1, 'wrinkles', prev);
    expect(result.concerns).toEqual(['glow']);
  });

  it('can select multiple concerns', () => {
    let state = updateAnswers(1, 'wrinkles', EMPTY);
    state = updateAnswers(1, 'glow', state);
    state = updateAnswers(1, 'spots', state);
    expect(state.concerns).toEqual(['wrinkles', 'glow', 'spots']);
  });
});

describe('updateAnswers – step 2 (single-choice ageRange)', () => {
  it('sets ageRange', () => {
    const result = updateAnswers(2, '30-39', EMPTY);
    expect(result.ageRange).toBe('30-39');
  });

  it('overwrites existing ageRange', () => {
    const prev = { ...EMPTY, ageRange: '20-29' };
    expect(updateAnswers(2, '50+', prev).ageRange).toBe('50+');
  });
});
