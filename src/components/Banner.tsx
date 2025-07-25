import axios from "../api/axios";
import React, { useEffect, useState } from "react";
import requests from "../api/request";
import "./Banner.css";
import styled from "styled-components";
import { Movie } from '../movie';

export default function Banner() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const request = await axios.get(requests.fetchNowPlaying);
        const movieId =
            request.data.results[
                Math.floor(Math.random() * request.data.results.length)
            ].id;

        const { data: movieDetail } = await axios.get(`movie/${movieId}`, {
            params: { append_to_response: "videos" },
        });
        setMovie(movieDetail);
    };

    const truncate = (str: string | undefined, n: number): string => {
        return str && str.length > n ? str.substr(0, n - 1) + "..." : str || "";
    };

    if (!movie) return null;

    if (!isClicked) {
        return (
            <header
                className="banner"
                style={{
                    backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
                    backgroundPosition: "top center",
                    backgroundSize: "cover",
                }}
            >
                <div className="banner__contents">
                    <h1 className="banner__title">
                        {movie.title || movie.name || movie.original_name}
                    </h1>

                    <div className="banner__buttons">
                        <button
                            className="banner__button play"
                            onClick={() => setIsClicked(true)}
                        >
                            Play
                        </button>
                        <button className="banner__button info">More Information</button>
                    </div>

                    <h1 className="banner__description">
                        {truncate(movie.overview, 100)}
                    </h1>
                </div>
                <div className="banner--fadeBottom"></div>
            </header>
        );
    } else {
        if (!movie?.videos?.results?.length) return <></>;
        return (
            <Container>
                <HomeContainer>
                    <Iframe
                        src={`https://www.youtube.com/embed/${movie.videos?.results[0].key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.videos?.results[0].key}`}
                        title="YouTube video player"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                    />
                </HomeContainer>
            </Container>
        );
    }
}

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.65;
  border: none;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
`;
