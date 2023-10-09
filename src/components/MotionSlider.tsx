import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import styled from "styled-components"
import { IMovies, mvCategory, tvCategory } from "../api"
import { makeImagePath } from "../utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate } from "react-router-dom"


const Slider = styled(motion.div)`
  
`


const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 10px;
  padding: 0 10px;
`

const Box = styled(motion.div)<{$bgPhoto: string}>`
  /* background-image: url(${props => props.$bgPhoto});
  background-size: cover;
  background-position: center center; */
  /* height: 200px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 66px;
  cursor: pointer;
  img {
    height: 200px;
    width: 100%;
    object-fit: cover;
  }
  & :first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`

const ButtonWrap = styled(motion.div)`
  position: absolute;
  top: 54px;
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled(motion.button)`
  z-index: 3;
  font-size: 48px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const PageWrap = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
`

const PageList = styled(motion.div)`
  width: 200px;
  display: flex;
  justify-content: space-evenly;
  align-items: center; 
  margin-bottom: 10px;
`

interface IPage {
  $current: number;
  $index: number;
}

const Page = styled(motion.div)<IPage>`
  width: 30px;
  height: 5px;
  background-color:  ${props => props.$current === props.$index 
  ? "rgba(255, 255, 255, 1)"
  : "rgba(255, 255, 255, 0.5)"};
`

const Info = styled(motion.div)`
  width: 100%;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  padding: 10px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`

const RowVariants = {
  hidden: ([isBack, page, maxPage, offset, len]: number[]) => ({
    x: page !== (isBack ? maxPage : 0)
    ? (window.outerWidth + 5) * (isBack ? -1 : 1)
    : (Math.floor(window.outerWidth/offset) * len  + 5) * (isBack ? -1 : 1),
  }),
  visible: {
    x: 0
  },
  exit: ([isBack, page, maxPage, offset, len]: number[]) => ({
    x: page !== (isBack ? maxPage : 0)
    ? (window.outerWidth + 5) * (isBack ? 1 : -1)
    : (Math.floor(window.outerWidth/offset) * len + 5) * (isBack ? 1 : -1),
  })
}

const BoxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex: 10,
    transition: {
      type: "tween",
      delay: 0.5
    }
  }
}

const InfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.5
    }
  }
}

interface IMotionSlider {
  category: mvCategory | tvCategory | "searchMv" | "searchTv";
  slideData: IMovies[];
  tap: "movie" | "tv";
}

const MotionSlider = ({ category, slideData, tap }: IMotionSlider) => {
  const offset = 6;
  const maxPage = Math.floor(slideData.length / offset);
  const lastPageLength = slideData.slice(offset * maxPage, offset * (maxPage + 1)).length;
  const [page, setPage] = useState(0);
  const [isBack, setIsBack] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [mouseOver, setMouseOver] = useState(0); 
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const increasePage = () => {
    if (leaving) return ;
    setIsBack(0);
    toggleLeaving();
    setPage(prev => prev === maxPage ? 0 : prev + 1);
  } 

  const decreasePage = () => {
    if (leaving) return ;
    setIsBack(1);
    toggleLeaving();
    setPage(prev => prev === 0 ? maxPage : prev - 1);
  }

  const toggleLeaving = () => setLeaving(prev => !prev);

  const onBoxClicked = (movieId: number) => {
    if (category === "searchTv" || category === "searchMv") {
      navigate(`./${movieId + ',' + category}?keyword=${keyword}`);
      return ;
    }
    if (tap === "movie")
      navigate(`/nomflix/movies/${movieId + ',' + category}`);
    if (tap === "tv")
      navigate(`/nomflix/tv/${movieId + ',' + category}`);
  }
  console.log('x');
  return (
    <Slider onMouseEnter={() => setMouseOver(1)} onMouseLeave={() => setMouseOver(0)}>
      <ButtonWrap initial={{opacity: 0}} animate={{opacity: mouseOver}}>
        <Button onClick={decreasePage}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button onClick={increasePage}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </ButtonWrap>
      <PageWrap initial={{opacity: 0}} animate={{opacity: mouseOver}}>
        <PageList>
          {Array.from({length: maxPage + 1}, (_, i) => i).map((el) => {
            return (
              <Page key={'key'+el} $index={el} $current={page}/>
            )
          })}
        </PageList>
      </PageWrap>
      <AnimatePresence custom={[isBack, page, maxPage, offset, lastPageLength]} initial={false} onExitComplete={toggleLeaving}>
        <Row 
          custom={[isBack, page, maxPage, offset, lastPageLength]}
          variants={RowVariants} 
          initial={"hidden"} 
          animate={"visible"} 
          exit={"exit"}
          transition={{type: "tween", duration: 1}}
          key={page} 
        >
          {
            slideData.slice(offset * page, offset * (page + 1)).map((movie) => {
              return (
                <Box 
                  layoutId={movie.id + "," + category}
                  variants={BoxVariants}
                  initial={"normal"}
                  whileHover={"hover"}
                  transition={{type: "tween"}}
                  key={movie.id + category}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <img src={makeImagePath(movie.backdrop_path || "", "w500")} alt="backdrop" />
                  <Info variants={InfoVariants} >
                    <h4>{tap === "movie" ? movie.title : movie.name}</h4>
                  </Info>
                </Box>
              )
            })
          }
          {
            page === maxPage 
              && slideData.slice(0, offset * (maxPage + 1) - slideData.length)
                .map((movie) => {
                  return (
                      <Box 
                        layoutId={movie.id + "," + category}
                        exit={{ opacity: isBack }}
                        key={movie.id}
                        $bgPhoto={makeImagePath(movie.backdrop_path || "", "w500")}
                      >
                        <img src={makeImagePath(movie.backdrop_path || "", "w500")} alt="backdrop" />
                        <Info variants={InfoVariants} >
                          <h4>{tap === "movie" ? movie.title : movie.name}</h4>
                        </Info>
                      </Box>
                  )
                })
          }
        </Row>
      </AnimatePresence>
    </Slider>
  )
}

export default MotionSlider;