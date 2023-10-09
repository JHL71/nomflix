import { useQuery } from "react-query";
import { useLocation, useMatch } from "react-router-dom";
import { IGetMoviesResult, IGetTvSeriesResult, searchMovie, searchTv } from "../api";
import styled from "styled-components";
import { AnimatePresence, useScroll } from "framer-motion";
import { MotionSlider, SelectedModal } from "../components";

const Wrap = styled.div`
  width: 100%;
  overflow: hidden;
  padding-bottom: 300px;
`

const Title = styled.h1`
  font-size: 66px;
  font-weight: 400;
  text-align: center;
  margin-top: 100px;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ResultWrap = styled.div`
  position: relative;
  margin-top: 250px;
  width: 100%;
  &:nth-child(2) {
    margin-top: 100px;
  }
`

const CategoryTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
`

const Search = () => {
  const location = useLocation();
  const bigMovieMatch = useMatch('/nomflix/search/:movieId');
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { scrollY } = useScroll();

  const { data: movies, isLoading: mloading } = useQuery<IGetMoviesResult>(["searchMv", keyword],
    () => searchMovie(keyword || ""),
    { refetchOnWindowFocus: false });
  const { data: tvSeries, isLoading: tloading } = useQuery<IGetTvSeriesResult>(["searchTv", keyword],
    () => searchTv(keyword || ""),
    { refetchOnWindowFocus: false });

  const clickedMovie = bigMovieMatch 
    && (bigMovieMatch.params.movieId?.split(',')[1] === 'searchMv'
      ? movies?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
      : tvSeries?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0]));
  
  return (
    <Wrap>
      <Title>search result : {keyword}</Title>
      {
        mloading || tloading
        ? <Loader>Loading...</Loader>
        : <>
            <ResultWrap>
              <CategoryTitle>Movies</CategoryTitle>
              <MotionSlider tap="movie" slideData={movies?.results || []} category="searchMv" />
            </ResultWrap>
            <ResultWrap>
              <CategoryTitle>Tv Series</CategoryTitle>
              <MotionSlider tap="tv" slideData={tvSeries?.results || []} category="searchTv" />
            </ResultWrap>
          </>
      }
      <AnimatePresence>
        {
          bigMovieMatch && 
            <>
              {clickedMovie &&
                <SelectedModal 
                  layoutId={bigMovieMatch.params.movieId || ""} 
                  id={clickedMovie.id} 
                  category={bigMovieMatch.params.movieId?.split(',')[1] === "searchMv" ? "movie" : "tv"}
                  scrollY={scrollY}
                />
              }
            </>
          }
      </AnimatePresence>
    </Wrap>
  );
}

export default Search;