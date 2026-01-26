import { useQueries } from '@tanstack/react-query'
import { subDays } from 'date-fns'

import { journalService } from '@features/journal/services/journal.service'
import { queryKeys } from '@shared/config/queryKeys'
import { toUTCDateString } from '@shared/utils/date'

import { calculateDayScore } from '../utils/score'

type DayScore = {
  date: Date
  score: number
}

export function useWeekScores(): DayScore[] {
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))
  const dateStrings = weekDays.map(toUTCDateString)

  const sleepQueries = useQueries({
    queries: dateStrings.map((date) => ({
      queryKey: queryKeys.journalSleep(date),
      queryFn: () => journalService.sleep.getByDate(date),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const mealQueries = useQueries({
    queries: dateStrings.map((date) => ({
      queryKey: queryKeys.journalMeal(date),
      queryFn: () => journalService.meal.getByDate(date),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const sportQueries = useQueries({
    queries: dateStrings.map((date) => ({
      queryKey: queryKeys.journalSport(date),
      queryFn: () => journalService.sport.getByDate(date),
      staleTime: 5 * 60 * 1000,
    })),
  })

  return weekDays.map((date, index) => {
    const sleepEntries = sleepQueries[index].data ?? []
    const mealEntries = mealQueries[index].data ?? []
    const sportEntries = sportQueries[index].data ?? []

    const sleepEntry = sleepEntries[0]

    return {
      date,
      score: calculateDayScore(sleepEntry, mealEntries, sportEntries),
    }
  })
}
