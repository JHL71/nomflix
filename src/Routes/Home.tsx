import { useQuery } from "react-query";
import { IGetMoviesResulte, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";

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
`

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`

const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResulte>(
    ["movies", "nowPlaying"], 
    getMovies, 
    {
      refetchOnWindowFocus: false
    }
  );
  console.log(data, isLoading);
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
        </>
      }
    </Wrap>
  );
}

export default Home;