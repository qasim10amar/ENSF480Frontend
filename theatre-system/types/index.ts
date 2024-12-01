export type Seat = {
    seatID: number;
    seatRow: number;
    seatColumn: number;
    seatPrice: number;
    isReserved: boolean;
  };
  

export type ShowTime = {
  showTimeId: number;
  showTime: string;
  seats: Seat[];
};

export type Movie = {
  movieId: number;
  title: string;
  genre: string; // Add this line
  showTimes: ShowTime[];
};

