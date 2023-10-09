import { useQuery } from "react-query";
import { IGetMoviesResulte, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { MotionSlider } from "../components";
import { useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";

const Wrap = styled.div`
  background: black;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 100px auto 0 auto;
  background-color: ${props => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 44px;
  position: relative;
  top: -80px;
`

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${props => props.theme.white.lighter};
`

const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResulte>(
    ["movies", "nowPlaying"], 
    getMovies, 
    {
      refetchOnWindowFocus: false
    }
  );
  const bigMovieMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const clickedMovie = 
    bigMovieMatch?.params.movieId && 
    data?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  const onOverlayClick = () => {
    navigate(-1);
  }

  return (
    <Wrap>
      {isLoading 
        ? <Loader>Loading...</Loader>
        : 
        <>
          <Banner $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <NowPlayingWrap>
            <MoviesTitle>Popular in Nomflix</MoviesTitle>
            <MotionSlider slideData={data?.results.slice(1) || []} />
          </NowPlayingWrap>
          <AnimatePresence>
            {bigMovieMatch && 
              <>
                <Overlay onClick={onOverlayClick} exit={{opacity: 0}} animate={{opacity: 1}}/>
                <BigMovie 
                  style={{
                    top: scrollY
                  }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && 
                    <>
                      <BigCover 
                        style={{ 
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`
                        }} 
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  }
                </BigMovie>
              </>
            }
          </AnimatePresence>
        </>
      }
    </Wrap>
  );
}

export default Home;