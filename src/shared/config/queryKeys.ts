export const queryKeys = {
  // User
  user: ['user'] as const,
  userProfile: () => [...queryKeys.user, 'profile'] as const,

  // Diagnosis
  diagnosis: ['diagnosis'] as const,
  diagnosisLatest: () => [...queryKeys.diagnosis, 'latest'] as const,

  // Journal
  journal: ['journal'] as const,
  journalEntries: (date: string) => [...queryKeys.journal, 'entries', date] as const,

  // Routine
  routine: ['routine'] as const,
} as const
