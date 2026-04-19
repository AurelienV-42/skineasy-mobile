import { storage } from '@lib/storage';

export type NotificationKind = 'dailyJournal' | 'bedtime' | 'mealPlanning';

const PREF_KEYS: Record<NotificationKind, string> = {
  dailyJournal: 'notifications.prefs.dailyJournal',
  bedtime: 'notifications.prefs.bedtime',
  mealPlanning: 'notifications.prefs.mealPlanning',
};

const IDS_KEY = 'notifications.scheduledIds';

export function getPref(kind: NotificationKind): boolean {
  const stored = storage.getBoolean(PREF_KEYS[kind]);
  return stored ?? true;
}

export function setPref(kind: NotificationKind, value: boolean): void {
  storage.set(PREF_KEYS[kind], value);
}

type ScheduledIds = Partial<Record<NotificationKind, string>>;

export function getScheduledIds(): ScheduledIds {
  const raw = storage.getString(IDS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ScheduledIds;
  } catch {
    return {};
  }
}

export function setScheduledId(kind: NotificationKind, id: string | null): void {
  const current = getScheduledIds();
  if (id) current[kind] = id;
  else delete current[kind];
  storage.set(IDS_KEY, JSON.stringify(current));
}
