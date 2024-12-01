import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import DatePicker from '@/components/DatePicker';
import { getSelectedDateShowtimes } from '@/utils/movieUtils';
import { getMovies } from '@/server/getMovies';
import { Movie, ShowTime } from '@/types';

type HomeProps = {
  movies: Movie[];
  initialDate: string;
};

const Home = ({ movies, initialDate }: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const router = useRouter();
  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, movies]);

  const handleShowtimeClick = (showTime: ShowTime, movie: Movie) => {
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    localStorage.setItem('SelectedShowtime', JSON.stringify(showTime))
    router.push(`/seats/${showTime.showTimeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header onSearch={setSearchQuery} />

      {/* Date Picker */}
      <div className="flex justify-center mt-4">
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Movie Grid */}
      <MovieGrid
        movies={filteredMovies}
        selectedDate={selectedDate}
        onShowtimeClick={handleShowtimeClick}
        getSelectedDateShowtimes={getSelectedDateShowtimes}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const movies = await getMovies(date);
  return { props: { movies, initialDate: date } };
};

export default Home;
