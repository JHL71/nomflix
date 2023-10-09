import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home, Search, Tv } from './Routes';
import { Header } from './components';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/movies/:movieId" element={<Home />}/>
          <Route path="/tv" element={<Tv />}/>
          <Route path="/search" element={<Search />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
