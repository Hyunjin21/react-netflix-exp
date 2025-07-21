import React, { useEffect, useState } from 'react';
import axios from "../api/axios";
import "./Row.css";
import MovieModal from './MovieModal/index';
import { Movie } from '../movie';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface RowProps {
    isLargeRow?: boolean;
    title: string;
    id: string;
    fetchUrl: string;
}
const Row: React.FC<RowProps> = ({
    isLargeRow,
    title,
    id,
    fetchUrl,
}) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [movieSelected, setMovieSelected] = useState<Movie | null>(null);

    useEffect(() => {
        const handleResize = () => {
            fetchMovieData();
        };

        window.addEventListener("resize", handleResize);

        fetchMovieData(); // 최초 1회

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [fetchUrl]); // fetchUrl이 변경될 경우도 대비

    const getGroupSize = () => {
        const width = window.innerWidth;
        if (width >= 1378) return 6;
        if (width >= 998) return 5;
        if (width >= 625) return 4;
        return 3;
    };

    const fetchMovieData = async () => {
        try {
            const request = await axios.get(fetchUrl);
            const results = request.data.results;

            const groupSize = getGroupSize();
            const trimmedResults = results.slice(0, results.length - (results.length % groupSize));

            setMovies(trimmedResults);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        }
    };



    // const handleScroll = (direction: "left" | "right") => {
    //     const posters = document.getElementById(id);
    //     if (posters) {
    //         const scrollAmount = window.innerWidth - 80;
    //         posters.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    //     }
    // };

    const handleClick = (movie: Movie) => {
        setModalOpen(true);
        setMovieSelected(movie);
    };

    return (
        <section className="row">
            <h2>{title}</h2>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                breakpoints={{
                    1378: { slidesPerView: 6, slidesPerGroup: 6 },
                    998: { slidesPerView: 5, slidesPerGroup: 5 },
                    625: { slidesPerView: 4, slidesPerGroup: 4 },
                    0: { slidesPerView: 3, slidesPerGroup: 3 },
                }}
            >
                <div id={id} className="row__posters">
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <img
                                className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
                                src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path
                                    }`}
                                alt={movie.name || movie.title || "Movie"}
                                onClick={() => handleClick(movie)}
                            />
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
            {modalOpen && (
                <MovieModal {...movieSelected} setModalOpen={setModalOpen} />
            )}
        </section>
        // <section className="row">
        //     <h2>{title}</h2>
        //     <div className="slider">
        //         <div className="slider__arrow-left" onClick={() => handleScroll("left")}>
        //             <span className="arrow">{"<"}</span>
        //         </div>
        //         <div id={id} className="row__posters">
        //             {movies.map((movie) => (
        //                 <img
        //                     className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
        //                     src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path
        //                         }`}
        //                     alt={movie.name || movie.title || "Movie"}
        //                     onClick={() => handleClick(movie)}
        //                 />
        //             ))}
        //         </div>
        //         <div className="slider__arrow-right" onClick={() => handleScroll("right")}>
        //             <span className="arrow">{">"}</span>
        //         </div>
        //     </div>
        //     {modalOpen && <MovieModal {...movieSelected} setModalOpen={setModalOpen} />}
        // </section>
    );
}

export default Row;
