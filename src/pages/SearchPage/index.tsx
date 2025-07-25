import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './SearchPage.css';
import { useDebounce } from '../../hooks/useDebounce';
import { Movie } from '../../movie';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState<Movie[]>([]);

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const searchTerm = query.get('q');
    const debounceSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debounceSearchTerm) {
            fetchSearchMovie(debounceSearchTerm);
        }
    }, [debounceSearchTerm]);

    const fetchSearchMovie = async (term: string) => {
        try {
            const request = await axios.get<{ results: Movie[] }>(
                `/search/multi?include_adult=false&query=${term}`
            );
            setSearchResults(request.data.results);
        } catch (error) {
            console.error('error', error);
        }
    };

    const renderSearchResults = () => {
        return searchResults.length > 0 ? (
            <section className="search-container">
                {searchResults.map((movie) => {
                    if (movie.backdrop_path !== null && movie.media_type !== 'person') {
                        const movieImageUrl =
                            'https://image.tmdb.org/t/p/w500' + movie.backdrop_path;
                        return (
                            <div className="movie" key={movie.id}>
                                <div
                                    onClick={() => navigate(`/${movie.id}`)}
                                    className="movie__column-poster"
                                >
                                    <img
                                        src={movieImageUrl}
                                        alt="movie"
                                        className="movie__poster"
                                    />
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </section>
        ) : (
            <section className="no-results">
                <div className="no-results__text">
                    <p>찾고자하는 검색어 "{debounceSearchTerm}"에 맞는 영화가 없습니다.</p>
                </div>
            </section>
        );
    };

    return renderSearchResults();
}

export default SearchPage;