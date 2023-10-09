const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";


export interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
} 

export interface ITvSeries {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
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

export type mvCategory = "now_playing" | "popular" | "top_rated" | "upcoming" | "trending";
export type tvCategory = "airing_today" | "on_the_air" | "popular" | "top_rated" | "trending";

export async function getMovies(category: mvCategory = "now_playing") {
  const res = await (await fetch(`${BASE_PATH}/movie/${category}?api_key=${API_KEY}`)).json();
  return res;
}

export async function getTvSeries(category: tvCategory) {
  const res = await (await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`)).json();
  return res;
}

export async function getTrending(category: string, time: string = "day") {
  const res = await (await fetch(`${BASE_PATH}/trending/${category}/${time}?api_key=${API_KEY}`)).json();
  return res;
}

export async function searchMulti(query: string) {
  query = query.split(' ').join('+');
  const res = await (await fetch(`${BASE_PATH}/search/multi?query=${query}&api_key=${API_KEY}`)).json();
  return res;
}

export async function getDetail(category: string, id: number) {
  const res = await (await fetch(`${BASE_PATH}/${category}/${id}?api_key=${API_KEY}`)).json();
  return res;
}