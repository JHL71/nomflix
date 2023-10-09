import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies, getTrending } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { MotionSlider, SelectedModal } from "../components";
import { useMatch } from "react-router-dom";
import { AnimatePresence, useScroll } from "framer-motion";

const Wrap = styled.div`
  background: black;
  padding-bottom: 300px;
  overflow: hidden;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Banner = styled.div<{$bgPhoto: string}>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
   url(${props => props.$bgPhoto});
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
`

const Title = styled.h2`
  font-size: 68px;
  font-weight: 400;
  margin-bottom: 20px;
`

const MoviesTitle = styled.h2`
  padding-left: 20px;
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 10px;
`

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`

const NowPlayingWrap = styled.div`
  position: relative;
  top: -100px;
  width: 100%;
`

const SliderWrap = styled.div`
  position: relative;
  margin-top: 250px;
  width: 100%;
  &:nth-child(3) {
    margin-top: 140px;
  }
`

const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"], 
    () => getMovies("now_playing"), 
    { refetchOnWindowFocus: false }
  );
  const { data: topRated, isLoading: topLoading } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"], 
    () => getMovies("top_rated"), 
    { refetchOnWindowFocus: false }
  );
  const { data: upcoming, isLoading: uLoading } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"], 
    () => getMovies("upcoming"), 
    { refetchOnWindowFocus: false }
  );
  const { data: trendingMv, isLoading: tLoading } = useQuery<IGetMoviesResult>(
    ["movies", "trending"], 
    () => getTrending("movie", "day"), 
    { refetchOnWindowFocus: false }
  );
  
  const bigMovieMatch = useMatch("/nomflix/movies/:movieId");
  const { scrollY } = useScroll();
  const clickedMovie = bigMovieMatch?.params.movieId
      && (bigMovieMatch.params.movieId.split(',')[1] === 'popular' 
        ? data?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
        : bigMovieMatch.params.movieId.split(',')[1] === 'top_rated'
          ? topRated?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
          : bigMovieMatch.params.movieId.split(',')[1] === 'trending'
            ? trendingMv?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
            : upcoming?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0]));

  return (
    <Wrap>
      {isLoading || topLoading || uLoading || tLoading
        ? <Loader>Loading...</Loader>
        : 
        <>
          <Banner $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <NowPlayingWrap>
            <MoviesTitle>Popular</MoviesTitle>
            <MotionSlider tap="movie" category={"popular"} slideData={data?.results.slice(1) || []} />
          </NowPlayingWrap>
          <SliderWrap>
            <MoviesTitle>Top Rated</MoviesTitle>
            <MotionSlider tap="movie" category={"top_rated"} slideData={topRated?.results || []} />
          </SliderWrap>
          <SliderWrap>
            <MoviesTitle>Trending</MoviesTitle>
            <MotionSlider tap="movie" category={"trending"} slideData={trendingMv?.results || []} />
          </SliderWrap>
          <SliderWrap>
            <MoviesTitle>Upcoming</MoviesTitle>
            <MotionSlider tap="movie" category={"upcoming"} slideData={upcoming?.results || []} />
          </SliderWrap>
          <AnimatePresence>
            {bigMovieMatch && 
              <>
                {clickedMovie &&
                  <SelectedModal 
                    layoutId={bigMovieMatch.params.movieId || ""} 
                    id={clickedMovie.id} 
                    category={"movie"}
                    scrollY={scrollY}
                  />
                }
              </>
            }
          </AnimatePresence>
        </>
      }
    </Wrap>
  );
}

export default Home;