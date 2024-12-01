import { useRouter } from 'next/router';
import { useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  const { seatIds, showTimeId } = router.query;

  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      const seatIdArray = (seatIds as string).split(',');
      const promises = seatIdArray.map((seatId) =>
        fetch(
          `http://localhost:8080/api/movie/${showTimeId}/createTicket?seatId=${seatId}&userEmail=${email}`,
          { method: 'POST' }
        )
      );

      const responses = await Promise.all(promises);

      if (responses.every((res) => res.ok)) {
        setSuccessMessage('Tickets successfully created!');
      } else {
        throw new Error('Failed to create some tickets.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="text-gray-600">Selected Seats: {seatIds}</p>
      <p className="text-gray-600">Showtime ID: {showTimeId}</p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded w-64"
      />
      <button
        onClick={handleCheckout}
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
