import { ShowTime } from '@/types';

export const getSelectedDateShowtimes = (showTimes: ShowTime[], date: string) => {
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  return showTimes
    .filter((showtime) => {
      const showTimeDate = new Date(showtime.showTime);
      showTimeDate.setHours(0, 0, 0, 0);
      return showTimeDate.getTime() === selectedDate.getTime();
    })
    .sort((a, b) => new Date(a.showTime).getTime() - new Date(b.showTime).getTime());
};
