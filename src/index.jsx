
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';

import Home from './Home';
import MovieDetail from './components/MovieDetail';
import TvShowDetails from './components/TvShowDetails';
import Player from './pages/Player';
import SearchPage from './components/SearchPage';
import UpcomingPage from './components/UpcomingPage';
import Privacy from './components/Others/NavSideFiles/Privacy';
import Terms from './components/Others/NavSideFiles/Terms';
import DMCA from './components/Others/NavSideFiles/DMCA';
import About from './components/Others/NavSideFiles/About';
import Contact from './components/Others/NavSideFiles/Contact';
import reportWebVitals from './reportWebVitals';
import './styles/root.css';
import './styles/Carousel.css';
import './styles/Movies.css';
import './styles/mobile.css';
import './styles/CustomCursor.css';
import CustomCursor from './components/CustomCursor.jsx';
import Layout from './components/Others/Layout';
import WelcomeLoader from './components/WelcomeLoader';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <HelmetProvider>
          <Router>
            <CustomCursor />
            <WelcomeLoader>
              <Routes>
                <Route path='/player/:id' element={<Player />} />
                <Route
                  path='/*'
                  element={
                    <Layout>
                      <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/movie/:id' element={<MovieDetail />} />
                        <Route path='/tv/:id' element={<TvShowDetails />} />
                        <Route path='/search' element={<SearchPage />} />
                        <Route path='/upcoming' element={<UpcomingPage />} />
                        <Route path='/privacy' element={<Privacy />} />
                        <Route path='/terms' element={<Terms />} />
                        <Route path='/dmca' element={<DMCA />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
            </WelcomeLoader>
          </Router>
        </HelmetProvider>
    </ClerkProvider>
  </React.StrictMode>
);

reportWebVitals();
