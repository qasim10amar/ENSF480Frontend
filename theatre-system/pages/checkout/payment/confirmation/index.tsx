import { useRouter } from 'next/router';

const ConfirmationPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Confirmed!
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment was successful, and your ticket details have been emailed to you. Thank you for your purchase!
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
