import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';
import MobileNavBar from './Others/MobileNavBar';
import '../styles/Movies.css';

const Search = () => {
    const { query } = useParams();
    const [results, setResults] = useState([]);
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

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${query}`);
                setResults(response.data.results);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        fetchSearch();
    }, [query]);

    return (
        <React.Fragment>
            <div className="movies-section with-buttons" style={{ paddingTop: '80px' }}>
                <div className="section-header">
                    <h2>Search Results for "{query}"</h2>
                </div>
                <div className="movies-grid">
                    {results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
            {isMobile && <MobileNavBar />}
        </React.Fragment>
    );
};

export default Search;
