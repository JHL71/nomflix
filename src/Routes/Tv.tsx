import { useQuery } from "react-query";
import { IGetTvSeriesResult, getTrending, getTvSeries } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { MotionSlider, SelectedModal } from "../components";
import { useMatch } from "react-router-dom";
import { AnimatePresence, useScroll } from "framer-motion";

const Wrap = styled.div`
  background: black;
  overflow: hidden;
  padding-bottom: 300px;
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
`

const SliderWrap = styled.div`
  position: relative;
  margin-top: 250px;
  &:nth-child(3) {
    margin-top: 140px;
  }
`

const Tv = () => {
  const { data, isLoading } = useQuery<IGetTvSeriesResult>(
    ["series", "Popular"], 
    () => getTvSeries("popular"), 
    { refetchOnWindowFocus: false }
  );
  const { data: topRated, isLoading: topLoading } = useQuery<IGetTvSeriesResult>(
    ["series", "topRated"], 
    () => getTvSeries("top_rated"), 
    { refetchOnWindowFocus: false }
  );
  const { data: onTheAir, isLoading: uLoading } = useQuery<IGetTvSeriesResult>(
    ["series", "onTheAir"], 
    () => getTvSeries("on_the_air"), 
    { refetchOnWindowFocus: false }
  );
  const { data: airingToday, isLoading: aLoading } = useQuery<IGetTvSeriesResult>(
    ["series", "airingToday"], 
    () => getTvSeries("airing_today"), 
    { refetchOnWindowFocus: false }
  );
  const { data: trendingMv, isLoading: tLoading } = useQuery<IGetTvSeriesResult>(
    ["series", "trending"], 
    () => getTrending("tv", "day"), 
    { refetchOnWindowFocus: false }
  );
  const bigMovieMatch = useMatch("/nomflix/tv/:movieId");
  const { scrollY } = useScroll();
  const clickedMovie = bigMovieMatch?.params.movieId
      && (bigMovieMatch.params.movieId.split(',')[1] === 'popular' 
        ? data?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
        : bigMovieMatch.params.movieId.split(',')[1] === 'top_rated'
          ? topRated?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
          : bigMovieMatch.params.movieId.split(',')[1] === 'trending'
            ? trendingMv?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
            : bigMovieMatch.params.movieId.split(',')[1] === 'on_the_air'
              ? onTheAir?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0])
              : airingToday?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId?.split(',')[0]));

  return (
    <Wrap>
      {isLoading || topLoading || uLoading || tLoading || aLoading
        ? <Loader>Loading...</Loader>
        : 
        <>
          <Banner $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <NowPlayingWrap>
            <MoviesTitle>Popular</MoviesTitle>
            <MotionSlider tap="tv" category={"popular"} slideData={data?.results.slice(1) || []} />
          </NowPlayingWrap>
          <SliderWrap>
            <MoviesTitle>Top Rated</MoviesTitle>
            <MotionSlider tap="tv" category={"top_rated"} slideData={topRated?.results || []} />
          </SliderWrap>
          <SliderWrap>
            <MoviesTitle>Trending</MoviesTitle>
            <MotionSlider tap="tv" category={"trending"} slideData={trendingMv?.results || []} />
          </SliderWrap>
          <SliderWrap>
            <MoviesTitle>On The Air</MoviesTitle>
            <MotionSlider tap="tv" category={"on_the_air"} slideData={onTheAir?.results || []} />
          </SliderWrap>
          <SliderWrap>
            <MoviesTitle>Airing Today</MoviesTitle>
            <MotionSlider tap="tv" category={"airing_today"} slideData={airingToday?.results || []} />
          </SliderWrap>
          <AnimatePresence>
            {
            bigMovieMatch && 
              <>
                {clickedMovie &&
                  <SelectedModal 
                    layoutId={bigMovieMatch.params.movieId || ""} 
                    id={clickedMovie.id} 
                    category={"tv"}
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

export default Tv;