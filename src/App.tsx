import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home, Search, Tv } from './Routes';
import { Header } from './components';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/nomflix" element={<Home />}/>
          <Route path="/nomflix/movies/:movieId" element={<Home />}/>
          <Route path="/nomflix/tv" element={<Tv />}/>
          <Route path="/nomflix/tv/:movieId" element={<Tv />}/>
          <Route path="/nomflix/search" element={<Search />}/>
          <Route path="/nomflix/search/:movieId" element={<Search />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
