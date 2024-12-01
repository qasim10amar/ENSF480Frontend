import React from 'react';
import { Movie, ShowTime } from '@/types';

type MovieGridProps = {
  movies: Movie[];
  selectedDate: string;
  onShowtimeClick: (showTime: ShowTime, movie: Movie) => void;
  getSelectedDateShowtimes: (showTimes: ShowTime[], date: string) => ShowTime[];
};

const MovieGrid = ({ movies, selectedDate, onShowtimeClick, getSelectedDateShowtimes }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {movies.map((movie) => {
        const todayShowtimes = getSelectedDateShowtimes(movie.showTimes, selectedDate);
        
        return (
          <div
            key={movie.movieId}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow"
          >
            {/* Movie Title */}
            <h2 className="text-lg font-bold mb-1">{movie.title}</h2>

            {/* Movie Genre */}
            <p className="text-sm text-gray-600 italic mb-2">Genre: {movie.genre}</p>

            {/* Showtimes */}
            <div>
              <h3 className="text-sm font-semibold">Showtimes:</h3>
              {todayShowtimes.length > 0 ? (
                todayShowtimes.map((showTime) => (
                  <button
                    key={showTime.showTimeId}
                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
                    onClick={() => onShowtimeClick(showTime, movie)}
                  >
                    {new Date(showTime.showTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No showtimes available for this date.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovieGrid;
