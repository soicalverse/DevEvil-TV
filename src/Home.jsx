
import React, { useState } from 'react';
import NavBar from './components/Others/NavBar';
import Banner from './components/Banner';
import SideBtn from './components/Others/SideButtons';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import Categories from './components/Categories';
import Anime from './components/Anime';
import AnimeTv from './components/AnimeTv';
import NowPlaying from './components/NowPlaying';
import PopularPerformers from './components/PopularPerformers';
import Footer from './components/Others/Footer';

const Home = () => {
  const [movieType, setMovieType] = useState('trending');
  const [tvShowType, setTvShowType] = useState('trending');
  const [page, setPage] = useState(1);

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
      <NavBar />
      <Banner />
      <SideBtn />
      <Movies movieType={movieType} page={page} setPage={setPage} onMovieTypeChange={handleMovieTypeChange} />
      <TvShows showType={tvShowType} page={page} setPage={setPage} onShowTypeChange={handleTvShowTypeChange} />
      <Categories />
      <Anime />
      <AnimeTv />
      <NowPlaying />
      <PopularPerformers />
      <Footer />
    </React.Fragment>
  );
};

export default Home;
