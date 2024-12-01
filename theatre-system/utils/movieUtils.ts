import { ShowTime } from '@/types';
import dayjs from 'dayjs';


export const getSelectedDateShowtimes = (showTimes: ShowTime[], date: string) => {
  const selectedDate = new Date(date + "T00:00:00");
  return showTimes
    .filter((showtime) => {
      const showTimeDate = new Date(showtime.showTime);
      showTimeDate.setHours(0, 0, 0, 0);
      return showTimeDate.getTime() === selectedDate.getTime();
    })
    .sort((a, b) => new Date(a.showTime).getTime() - new Date(b.showTime).getTime());
};

export const formatDateTime = (dateString: string) => {
  return dayjs(dateString).format('MMMM D, YYYY h:mm A'); // Example format
};
