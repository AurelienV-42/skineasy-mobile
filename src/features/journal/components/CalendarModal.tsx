import { format } from 'date-fns';
import { useState } from 'react';
import { Calendar, type DateData } from 'react-native-calendars';

import { CalendarDayCircle } from '@features/calendar/components/CalendarDayCircle';
import { useMonthScores } from '@features/calendar/hooks/useMonthScores';
import { BottomSheet } from '@shared/components/bottom-sheet';
import { colors } from '@theme/colors';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function CalendarModal({
  visible,
  onClose,
  selectedDate,
  onDateSelect,
}: CalendarModalProps): React.ReactElement {
  const todayDate = new Date();
  const today = format(todayDate, 'yyyy-MM-dd');
  const [visibleMonth, setVisibleMonth] = useState({
    year: todayDate.getFullYear(),
    month: todayDate.getMonth(),
  });

  const { scores } = useMonthScores(visibleMonth.year, visibleMonth.month);

  const handleDayPress = (day: DateData): void => {
    onDateSelect(day.dateString);
    onClose();
  };

  const handleMonthChange = (month: DateData): void => {
    setVisibleMonth({ year: month.year, month: month.month - 1 });
  };

  const renderDay = ({
    date,
    state,
  }: {
    date?: DateData;
    state?: string;
  }): React.ReactElement | null => {
    if (!date) return null;
    return (
      <CalendarDayCircle
        day={date.day}
        score={scores[date.dateString] ?? 0}
        state={state ?? ''}
        isSelected={date.dateString === selectedDate}
        onPress={() => handleDayPress(date)}
      />
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} backgroundColor={colors.background}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        maxDate={today}
        enableSwipeMonths
        dayComponent={renderDay}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.textMuted,
          monthTextColor: colors.brownDark,
          textMonthFontWeight: 'bold',
          textMonthFontSize: 17,
          arrowColor: colors.brownDark,
        }}
      />
    </BottomSheet>
  );
}
