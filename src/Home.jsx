import React, { useState, useEffect } from 'react';
import NavBar from './components/Others/NavBar';
import MobileNavBar from './components/Others/MobileNavBar';
import Banner from './components/Banner';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import Categories from './components/Categories';
import Anime from './components/Anime';
import AnimeTv from './components/AnimeTv';
import Footer from './components/Others/Footer';

const Home = () => {
  const [movieType, setMovieType] = useState('trending');
  const [tvShowType, setTvShowType] = useState('trending');
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMovieTypeChange = (type) => {
    setMovieType(type);
    setPage(1);
  };

  const handleTvShowTypeChange = (type) => {
    setTvShowType(type);
    setPage(1);
  };

  return (
    <React.Fragment>
      {isMobile ? <MobileNavBar /> : <NavBar />}
      <Banner />
      <Movies movieType={movieType} page={page} setPage={setPage} onMovieTypeChange={handleMovieTypeChange} />
      <TvShows showType={tvShowType} page={page} setPage={setPage} onShowTypeChange={handleTvShowTypeChange} />
      <Categories />
      <Anime />
      <AnimeTv />
      <Footer />
    </React.Fragment>
  );
};

export default Home;
