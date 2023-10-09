import { MotionValue, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { makeImagePath } from "../utils"
import { useQuery } from "react-query"
import { IDetail, getDetail } from "../api"

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  overflow: scroll;
`

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
  align-items: last baseline;
`

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 44px;
  position: relative;
`

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  color: ${props => props.theme.white.lighter};
  overflow: scroll;
`

const RateWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Rate = styled.div`
  padding: 20px;
`

const GenreWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
`

const Genre = styled.div`
  width: 100px;
  height: 30px;
  border-radius: 10px;
  background-color: ${props => props.theme.black.darker};
  display: flex;
  justify-content: center;
  align-items: center;
`

interface ISelectedModal {
  layoutId: string;
  id: number;
  category: "movie" | "tv";
  scrollY: MotionValue<number>;
}

const SelectedModal = ({layoutId, id, category, scrollY}: ISelectedModal) => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IDetail>(["detail", id],
    () => getDetail(category, id), {
    refetchOnWindowFocus: false
  })

  const onOverlayClick = () => navigate(-1);
  
  return (
      <>
        <Overlay onClick={onOverlayClick} exit={{opacity: 0}} animate={{opacity: 1}}/>
        <BigMovie 
          style={{
            top: scrollY
          }}
          layoutId={layoutId}
        >
          {isLoading 
            ? <Loader>Loading...</Loader> 
            :
            <>
              <BigCover 
                style={{ 
                  backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(data?.backdrop_path || "", "w500")})`
                }} 
              >
              <BigTitle>{data?.name || data?.title}</BigTitle>
              </BigCover>
              <BigOverview>{data?.overview}</BigOverview>
              <RateWrap>
                <Rate>rating: {data?.vote_average + ' / ' + data?.vote_count}</Rate>
                {data?.runtime && <Rate>run time: {data.runtime}</Rate>}
              </RateWrap>
              <GenreWrap>
                {data?.genres.map((el) => {
                  return (
                    <Genre key={el.id}>{el.name}</Genre>
                  )
                })
                }
              </GenreWrap>
            </>
          }
        </BigMovie>
      </>
  )
}

export default SelectedModal;