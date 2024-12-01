import { getMovies } from "@/server/getMovies";
import { getSeats } from "@/server/getSeats";
import { GetServerSideProps } from "next";

type Props = {

}
const MoviesPage = (props: Props) => {
  return (
    <div>[date]</div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { searchDate } = context.params as { searchDate: string };

  try {
    const movies = getMovies(searchDate)
    return { props: { movies: movies } };
  } catch (error) {
    console.error('Error fetching seats:', error);
    return { props: { movies: [] } };
  }
};