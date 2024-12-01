import { Seat } from '@/types';

export const getSeats = async (showTimeId: number): Promise<Seat[]> => {
  try {
    console.log(`Fetching seat data for showTimeId: ${showTimeId}`);
    const response = await fetch(`http://localhost:8080/api/movie/get/${showTimeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch seat map: ${response.statusText}`);
    }
    const data = await response.json();
    return data.seats;
  } catch (error) {
    console.error('Error fetching seat map:', error);
    throw error; // Re-throw error to handle it upstream
  }
};
