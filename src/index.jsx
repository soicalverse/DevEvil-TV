
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ClerkProvider } from '@clerk/clerk-react';

import Home from './Home';
import MovieDetail from './components/MovieDetail';
import Player from './components/Player';
import SearchPage from './components/SearchPage';
import UpcomingPage from './components/UpcomingPage';
import Privacy from './components/Others/NavSideFiles/Privacy';
import Terms from './components/Others/NavSideFiles/Terms';
import DMCA from './components/Others/NavSideFiles/DMCA';
import About from './components/Others/NavSideFiles/About';
import reportWebVitals from './reportWebVitals';
import './styles/root.css';
import './styles/Carousel.css';
import './styles/Movies.css';
import './styles/mobile.css';
import './styles/CustomCursor.css';
import CustomCursor from './components/CustomCursor.tsx';
import Layout from './components/Others/Layout';
import WelcomeLoader from './components/WelcomeLoader';
import './adblocker.js';

const PUBLISHABLE_KEY = 'pk_test_YnJpZWYtc2FpbGZpc2gtNDkuY2xlcmsuYWNjb3VudHMuZGV2JA';

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <HelmetProvider>
        <Router>
          <CustomCursor />
          <WelcomeLoader>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<MovieDetail />} />
                <Route path="/player/:id" element={<Player />} />
                <Route path="/player/:id?e=:episode&s=:season" element={<Player />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/dmca" element={<DMCA />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
          </WelcomeLoader>
        </Router>
      </HelmetProvider>
    </ClerkProvider>
  </React.StrictMode>,
);

reportWebVitals();
