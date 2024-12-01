
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Payment = () => {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [createdTickets, setCreatedTickets] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load created tickets from localStorage
    const storedTickets = localStorage.getItem('createdTickets');
    if (storedTickets) {
      setCreatedTickets(JSON.parse(storedTickets));
    }
  }, []);

  const handleConfirmPurchase = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setErrorMessage('Please fill in all card details.');
      return;
    }

    try {
      // Simulate processing payment for each ticket
      for (const ticketId of createdTickets) {
        const response = await fetch(
          `http://localhost:8080/api/payment/create?ticketId=${ticketId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cardNumber,
              expiryDate,
              cvv,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to confirm payment for a ticket.');
        }
      }

      // If all tickets are successfully processed
      setSuccessMessage('Payment successfully processed!');
      localStorage.removeItem('createdTickets'); // Clear tickets after payment
      setTimeout(() => router.push('/confirmation'), 2000); // Redirect to confirmation page
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while processing payment.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Payment</h1>
      <p>Enter your card details to confirm the purchase.</p>

      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="p-2 border rounded w-64"
      />
      <input
        type="text"
        placeholder="Expiry Date (MM/YY)"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        className="p-2 border rounded w-64"
      />
      <input
        type="text"
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
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
    </div>
  );
};

export default Payment;
