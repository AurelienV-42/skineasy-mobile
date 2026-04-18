import { storage } from '@lib/storage';

const KEYS = {
  LOCALE: 'locale',
  SPORT_GOAL_MINUTES: 'sport_goal_minutes',
} as const;

const DEFAULT_SPORT_GOAL_MINUTES = 120; // 2 hours

export async function getLocale(): Promise<string | null> {
  return storage.getString(KEYS.LOCALE) ?? null;
}

export async function setLocale(locale: string): Promise<void> {
  storage.set(KEYS.LOCALE, locale);
}

export async function getSportGoal(): Promise<number> {
  return storage.getNumber(KEYS.SPORT_GOAL_MINUTES) ?? DEFAULT_SPORT_GOAL_MINUTES;
}
