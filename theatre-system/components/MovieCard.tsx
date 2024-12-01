import { Movie, ShowTime } from '@/types';

type MovieCardProps = {
  movie: Movie;
  showtimes: ShowTime[];
  onShowtimeClick: (showTime: ShowTime) => void;
};

const MovieCard = ({ movie, showtimes, onShowtimeClick }: MovieCardProps) => {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg mb-2">{movie.title}</h2>
      <h3 className="font-semibold">Showtimes:</h3>
      <ul>
        {showtimes.length > 0 ? (
          showtimes.map((showtime) => (
            <li key={showtime.showTimeId}>
              <button
                onClick={() => onShowtimeClick(showtime)}
                className="text-blue-500 underline"
              >
                {new Date(showtime.showTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </button>
            </li>
          ))
        ) : (
          <p>No showtimes available for the selected date.</p>
        )}
      </ul>
    </div>
  );
};

export default MovieCard;
