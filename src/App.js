import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Movie from './components/Movie';
import TV from './components/TV';
import Search from './components/Search';
import Footer from './components/Footer';
import Discover from './components/Discover';
import Person from './components/Person';
import NotFound from './components/NotFound';
import Collection from './components/Collection';
import AdblockerModal from './components/AdblockerModal';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/tv/:id" element={<TV />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
        <Footer />
        <AdblockerModal />
      </div>
    </Router>
  );
}

export default App;
