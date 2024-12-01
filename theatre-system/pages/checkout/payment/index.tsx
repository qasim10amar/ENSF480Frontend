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

  const validateCardDetails = () => {
    // Validate card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      setErrorMessage('Card number must be 16 digits.');
      return false;
    }

    // Validate expiry date (MM/YY format and not expired)
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const expiry = new Date(Number(`20${year}`), Number(month) - 1);

    if (!month || !year || isNaN(expiry.getTime()) || expiry < currentDate) {
      setErrorMessage('Expiry date must be in MM/YY format and not expired.');
      return false;
    }

    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      setErrorMessage('CVV must be 3 digits.');
      return false;
    }

    // Clear error if all validations pass
    setErrorMessage('');
    return true;
  };

  const handleConfirmPurchase = async () => {
    if (!validateCardDetails()) return; // Stop if validation fails
  
    // Format expiry date as the first day of the month (YYYY-MM-DD)
    const [month, year] = expiryDate.split('/');
    const formattedExpiryDate = `20${year}-${month.padStart(2, '0')}-01`;
  
    const card = {
      cardNum: cardNumber, // Matches the `cardNum` field in the Card entity
      expiry: formattedExpiryDate, // Use formatted expiry date
      cvc: parseInt(cvv, 10), // Convert CVV to an integer
    };
  
    try {
      // Simulate processing payment for each ticket
      for (const ticketId of createdTickets) {
        const response = await fetch(`http://localhost:8080/api/payment/create?ticketId=${ticketId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(card), // Send card details as JSON
        });
  
        if (!response.ok) {
          throw new Error('Failed to process payment for a ticket.');
        }
      }
  
      // If all tickets are successfully processed
      setSuccessMessage('Payment successfully processed!');
      localStorage.removeItem('createdTickets'); // Clear tickets after payment
      setTimeout(() => router.push('./payment/confirmation'), 2000); // Redirect to confirmation page
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
