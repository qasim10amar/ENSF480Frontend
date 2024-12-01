import { Movie, Seat, ShowTime } from '@/types';
import { formatDateTime } from '@/utils/movieUtils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  const { showTimeId } = router.query;
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [time, setTime] = useState('');
  useEffect(() => {
    const storedMovie = localStorage.getItem('selectedMovie');
    const storedSeats = localStorage.getItem('selectedSeats');
    const storedShowtime = localStorage.getItem('SelectedShowtime')
    if (storedSeats) {
      setSeats(JSON.parse(storedSeats));
    }
    if (storedMovie) {
      setMovie(JSON.parse(storedMovie));
    }
    if (storedShowtime) {
      const parsedShowtime = JSON.parse(storedShowtime); // Parse the JSON string
      if (parsedShowtime && parsedShowtime.showTime) {
        setTime(parsedShowtime.showTime); // Access the showTime property
      }
    }
  }, []);

  const handleConfirmPurchase = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid email.');
      return;
    }

    try {
      const response = await fetch('/api/create-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seatIds: seats.map((seat) => seat.seatID),
          showTimeId,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Tickets successfully created!');
        localStorage.removeItem('selectedSeats'); // Clear selected seats from localStorage
      } else {
        setErrorMessage('Failed to create tickets. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {movie && (
        <p className="text-gray-600">
          {movie.title} at {formatDateTime(time)}
        </p>
      )}
      <h2>Selected Seat(s):</h2>
      <ul>
        {seats.map((seat: Seat) => (
          <li key={seat.seatID}>
            {seat.seatNumber}: ${seat.seatPrice}
          </li>
        ))}
      </ul>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded w-64"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        onClick={handleConfirmPurchase}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Confirm Purchase
      </button>
      {successMessage && (
        <p className="text-green-500 font-medium">{successMessage}</p>
      )}
      <button
        onClick={() => router.push('/')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Movies
      </button>
    </div>
  );
};

export default Checkout;