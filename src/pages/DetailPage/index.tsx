import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { Movie } from '../../movie';

const DetailPage: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(`/movie/${movieId}`);
                setMovie(request.data);
            } catch (error) {
                console.error("Failed to fetch movie detail:", error);
            }
        }
        fetchData();
    }, [movieId]);

    if (!movie) return <div>...loading</div>;

    return (
        <section>
            <img
                className="modal__poster-img"
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt="poster"
            />
        </section>
    );
}

export default DetailPage;