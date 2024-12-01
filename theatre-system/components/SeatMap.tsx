import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Seat } from '@/types';

type SeatMapProps = {
  showTimeId: number;
  initialSeats: Seat[];
  onBack: () => void;
};

const SeatMap = ({ showTimeId, initialSeats, onBack }: SeatMapProps) => {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const router = useRouter();

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.isReserved) return; // Prevent selecting reserved seats

    setSelectedSeats((prev) =>
      prev.some((s) => s.seatID === seat.seatID)
        ? prev.filter((s) => s.seatID !== seat.seatID) // Deselect seat
        : [...prev, seat] // Add seat to selection
    );
  };

  const handleCheckout = () => {
    const seatIds = selectedSeats.map((seat) => seat.seatID).join(',');
    router.push(`/checkout/checkout?seatIds=${seatIds}&showTimeId=${showTimeId}`);
  };

  const totalRows = Math.max(...seats.map((seat) => seat.seatRow));
  const totalColumns = Math.max(...seats.map((seat) => seat.seatColumn));

  const seatGrid: (Seat | null)[][] = Array.from({ length: totalRows }, () =>
    Array.from({ length: totalColumns }, () => null)
  );

  seats.forEach((seat) => {
    seatGrid[seat.seatRow - 1][seat.seatColumn - 1] = seat;
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Seat Map</h2>
      <p className="text-gray-600 text-sm">Reserved seats are marked in gray</p>
      <div className="inline-block border border-gray-300 rounded p-4 bg-white">
        <div
          className={`grid gap-2`}
          style={{
            gridTemplateColumns: `1.5rem repeat(${totalColumns}, 2.5rem)`,
          }}
        >
          <div className="w-6 h-6"></div>
          {Array.from({ length: totalColumns }).map((_, colIndex) => (
            <div key={colIndex} className="text-center font-medium text-sm">
              {colIndex + 1}
            </div>
          ))}

          {seatGrid.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="text-center font-medium text-sm">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              {row.map((seat, colIndex) =>
                seat ? (
                  <div
                    key={colIndex}
                    onClick={() => toggleSeatSelection(seat)}
                    className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer ${
                      seat.isReserved
                        ? 'bg-gray-400 text-white'
                        : selectedSeats.some((s) => s.seatID === seat.seatID)
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-black'
                    }`}
                    title={`Row ${String.fromCharCode(65 + rowIndex)}, Seat ${
                      colIndex + 1
                    }`}
                  >
                    {colIndex + 1}
                  </div>
                ) : (
                  <div key={colIndex} className="w-10 h-10"></div>
                )
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Movies
        </button>
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={selectedSeats.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default SeatMap;
