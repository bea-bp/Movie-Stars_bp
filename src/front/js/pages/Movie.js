import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/Movie.css";
import { useParams } from "react-router-dom";
import no_trailer2 from "../../img/no_trailer2.png";
import no_image from "../../img/no_image.png";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useJwt } from "react-jwt";
import { Spinner } from "../component/Spinner";


export const Movie = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true)
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const imageUrl = movie?.image ? `https://image.tmdb.org/t/p/w500${movie?.image}` : no_image;
    const trailerUrl = movie?.trailer_key ? `https://www.youtube.com/embed/${movie.trailer_key}` : null;

    // const logged = store.logged

    // const token = localStorage.getItem("token");
    // if (!token) return;

    // const { decodedToken, isExpired } = useJwt(token);


    // let userId = null;
    // if (decodedToken && !isExpired) {
    //     userId = decodedToken.sub;
    // }

    // Obtiene el token del local storage
    const token = localStorage.getItem("token");

    // Si hay un token, verifica si ha expirado y obtén el userId
    let userId = null;
    if (token) {
        const { decodedToken, isExpired } = useJwt(token);
        if (decodedToken && !isExpired) {
            userId = decodedToken.sub;
        }
    }

    const [isFavorite, setIsFavorite] = useState(false);
    const handleFavorite = async () => {
        if (isFavorite) {
            // Realiza lógica para eliminarlo de favoritos
            // ...
            await actions.deleteFavorite(movie.id, "movies", userId);
        } else {
            if (movie && movie.id) {
                await actions.addFavorite({ movie_id: movie.id, favorite_type: "movies" }, userId);
            }
        }
        setIsFavorite(!isFavorite); // Cambia el estado cuando se hace clic en el botón
    };


    useEffect(() => {
        actions.getMovieById(movieId).then(movie => {
            setMovie(movie);
            setLoading(false)
        });

        const fetchInitialIsFavorite = async () => {
            if (userId) {
                const initialIsFavorite = await actions.isFavorite(movieId);
                setIsFavorite(initialIsFavorite);
            }
        };
        fetchInitialIsFavorite();

    }, [movieId, userId]);

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mt-5 mb-3">
                            <div className="movie-title-container">
                                <h3>{movie?.name}</h3>
                            </div>
                              


                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <div className="card mt-1">
                                <img className="card-img-top" src={imageUrl} alt="Poster" />
                            </div>
                        </div>
                        <div className="col-md-4 d-flex flex-column top-aligned">
                            <div>
                                {movie?.genres?.map((genre, index) => (
                                    <button key={index} className="gender">{genre.name}</button>
                                ))}
                                <i className="fa fa-star star-icon"></i>
                                <span className="ranking">{movie?.ranking.toFixed(1)}/10</span>
                            </div>

                            <div className="description">
                                <p>{movie?.description}</p>
                            </div>

                            <div>
                                {
                                    token &&
                                    <button
                                        className="favorite-button btn"
                                        aria-label="Agregar a favoritos"
                                        title="Add to favorites"
                                        onClick={handleFavorite}>
                                        {isFavorite ? (
                                            <i className="fa-solid fa-heart text-warning fa-lg"></i>
                                        ) : (
                                            <i className="fa-regular fa-heart text-warning fa-lg"></i>
                                        )}
                                    </button>
                                }
                            </div>

                        </div>

                        <div className="col-md-6 d-flex flex-column align-items-right">
                            {trailerUrl ? (
                                <div className="video-container">
                                    <iframe
                                        width="640"
                                        height="360"
                                        src={trailerUrl}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            ) : (
                                <div className="image-container">
                                    <img src={no_trailer2} alt="No trailer available" className="trailer-size" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="container-crew">
                        <div className="d-flex  align-items-center">
                            <h4 className="act_direct">Actors and Directors</h4>
                        </div>

                        <div className="row">
                            {movie?.actors?.map((actor) => (
                                <div className="col-md-2" key={actor.id}>
                                    <Link to={`/${movieId}/actors/${actor.id}`}>
                                        <div className="card">
                                            <img
                                                className="profile_path"
                                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : no_image}
                                                alt={actor.name} />
                                        </div>
                                        <p className="card-name">{actor.name}</p>
                                        <p className="card-character">Character: {actor.character}</p>
                                        <p className="card-department">Department: {actor.known_for_department}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="row">
                            {movie?.directors?.map((director) => (
                                <div className="col-md-2" key={director.id}>
                                    <Link to={`/${movieId}/directors/${director.id}`}>
                                        <div className="card">
                                            <img
                                                className="profile_path"
                                                src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : no_image}
                                                alt={director.name} />
                                        </div>
                                        <p className="card-name">{director.name}</p>
                                        <p className="card-department">Department: {director.known_for_department}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}