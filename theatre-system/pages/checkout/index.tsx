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
  const [createdTickets, setCreatedTickets] = useState<number[]>([]); // Store ticket IDs

  useEffect(() => {
    const storedMovie = localStorage.getItem('selectedMovie');
    const storedSeats = localStorage.getItem('selectedSeats');
    const storedShowtime = localStorage.getItem('SelectedShowtime');
    if (storedSeats) {
      setSeats(JSON.parse(storedSeats));
    }
    if (storedMovie) {
      setMovie(JSON.parse(storedMovie));
    }
    if (storedShowtime) {
      const parsedShowtime = JSON.parse(storedShowtime);
      if (parsedShowtime && parsedShowtime.showTime) {
        setTime(parsedShowtime.showTime);
      }
    }
  }, []);
  
  // Sync `createdTickets` with `localStorage`
  useEffect(() => {
    if (createdTickets.length > 0) {
      localStorage.setItem('createdTickets', JSON.stringify(createdTickets));
    }
  }, [createdTickets]);
  
  const handleConfirmPurchase = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid email.');
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/movie/${showTimeId}/createTickets?userEmail=${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(seats.map((seat) => seat.seatID)),
        }
      );
  
      if (response.ok) {
        const data = await response.json(); // Assume this returns the created ticket IDs
        setCreatedTickets(
          data.map((ticket: { ticketId: string }) => ticket.ticketId)
        );
        setSuccessMessage('Tickets successfully created!');
        localStorage.removeItem('selectedSeats');
        router.push('/checkout/payment'); // Redirect to payment page
      } else {
        setErrorMessage('Failed to create tickets. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  // Cleanup logic if the user doesn't complete payment
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (createdTickets.length > 0) {
        try {
          await fetch(`http://localhost:8080/api/movie/deleteTickets`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createdTickets), // Send the ticket IDs to delete
          });
          console.log('Unpaid tickets deleted.');
        } catch (error) {
          console.error('Failed to delete tickets:', error);
        }
      }
    }, 300000); // 5 minutes timeout

    return () => clearTimeout(timeout); // Clear timeout if the component unmounts
  }, [createdTickets]);

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
        Checkout
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
