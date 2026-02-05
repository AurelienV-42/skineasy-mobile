import { format } from 'date-fns'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CalendarDayDetail } from '@features/calendar/components/CalendarDayDetail'
import { CalendarModal } from '@features/journal/components/CalendarModal'
import { JournalHeader } from '@features/journal/components/JournalHeader'

export default function JournalScreen(): React.ReactElement {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'))
  const [calendarVisible, setCalendarVisible] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <JournalHeader selectedDate={selectedDate} onOpenCalendar={() => setCalendarVisible(true)} />
      <CalendarDayDetail date={selectedDate} />
      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </SafeAreaView>
  )
}
