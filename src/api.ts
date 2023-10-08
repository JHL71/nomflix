const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";


export interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
} 

export interface IGetMoviesResulte {
  dates: {
    minimum: string,
    maximum: string,
  };
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number
}

export async function getMovies() {
  const res = await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)).json();
  return res;
}