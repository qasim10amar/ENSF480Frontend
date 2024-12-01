import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Seat } from '@/types';
import SeatMap from '@/components/SeatMap';
import { getSeats } from '@/server/getSeats';

type SeatPageProps = {
  initialSeats: Seat[];
  showTimeId: number;
};

const SeatPage = ({ initialSeats, showTimeId }: SeatPageProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center pt-10">
      <SeatMap
        showTimeId={showTimeId}
        initialSeats={initialSeats}
        onBack={() => router.push('/')}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { showtimeId } = context.params as { showtimeId: string };

  try {
    const seats = await getSeats(Number(showtimeId));
    return { props: { initialSeats: seats, showTimeId: Number(showtimeId) } };
  } catch (error) {
    console.error('Error fetching seats:', error);
    return { props: { initialSeats: [], showTimeId: Number(showtimeId) } };
  }
  
};

export default SeatPage;
