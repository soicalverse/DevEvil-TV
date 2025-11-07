
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import the new Home component
import MovieDetail from './components/MovieDetail';
import TvShowDetails from './components/TvShowDetails';
import Player from './components/Player';
import SearchPage from './components/SearchPage';
import NavBar from './components/Others/NavBar';
import UpcomingPage from './components/UpcomingPage';
import Privacy from './components/Others/NavSideFiles/Privacy';
import Terms from './components/Others/NavSideFiles/Terms';
import DMCA from './components/Others/NavSideFiles/DMCA';
import About from './components/Others/NavSideFiles/About';
import reportWebVitals from './reportWebVitals';
import './styles/root.css';
import './styles/Carousel.css';
import './styles/Movies.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Use the Home component for the root path */}
        <Route path="/movie/:id" element={<React.Fragment><NavBar /><MovieDetail /></React.Fragment>} />
        <Route path="/tv/:id" element={<React.Fragment><NavBar /><TvShowDetails /></React.Fragment>} />
        <Route path="/player/:id" element={<Player/>} />
        <Route path="/player/:id?e=:episode&s=:season" element={<Player/>} />
        <Route path="/search" element={<React.Fragment><NavBar /><SearchPage /></React.Fragment>} />
        <Route path="/upcoming" element={<React.Fragment><NavBar /><UpcomingPage /></React.Fragment>} />
        <Route path="/privacy" element={<React.Fragment><NavBar /><Privacy /></React.Fragment>} />
        <Route path="/terms" element={<React.Fragment><NavBar /><Terms /></React.Fragment>} />
        <Route path="/dmca" element={<React.Fragment><NavBar /><DMCA /></React.Fragment>} />
        <Route path="/about" element={<React.Fragment><NavBar /><About /></React.Fragment>} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

reportWebVitals();
