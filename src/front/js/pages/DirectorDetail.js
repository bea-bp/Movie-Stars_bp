import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/DirectorDetail.css";
import { useParams, Link } from "react-router-dom";
import no_image from "../../img/no_image.png";
import { useJwt } from "react-jwt";
import { Spinner } from "../component/Spinner";

export const DirectorDetail = () => {
    const { store, actions } = useContext(Context);
    const { directorId, movieId } = useParams();
    const [loading, setLoading] = useState(true);
    const [directorDetail, setDirectorDetail] = useState(null);
    const [directorMovies, setDirectorMovies] = useState([]);

    const birthDate = directorDetail?.birthday ? new Date(directorDetail?.birthday) : null;
    const formattedBirthDate = birthDate ? birthDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";

    const deathDate = directorDetail?.deathday ? new Date(directorDetail?.deathday) : null;
    const formattedDeathDate = deathDate ? deathDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";

    const imageUrl = directorDetail?.profile_path
        ? `https://image.tmdb.org/t/p/w500${directorDetail?.profile_path}`
        : no_image;


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
            await actions.deleteFavorite(directorId, "directors", userId);
        } else {
            if (directorDetail && directorId) {
                await actions.addFavorite({ director_id: directorId, favorite_type: "directors" }, userId);
            }
        }
        setIsFavorite(!isFavorite); // Cambia el estado cuando se hace clic en el botón

    };


    useEffect(() => {
        actions.getDirectorById(directorId).then(director => {
            setDirectorDetail(director);
            return actions.getMoviesByDirector(directorId);
        }).then(movies => {
            setDirectorMovies(movies);
        }).catch(error => {
            console.error("Hubo un error al cargar los datos:", error);
        });
        setLoading(false)
    }, [directorId]);


    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (

                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mt-5 mb-1">

                            <div className="d-flex ">
                                <h1>{directorDetail?.name}</h1>

                                <div>
                                    {
                                        token &&
                                        <button
                                            className="favorite-button btn"
                                            aria-label="Agregar a favoritos"
                                            title="Add to favorites"  // Tooltip
                                            onClick={handleFavorite}>
                                            {isFavorite ? (
                                                <i className="fa-solid fa-heart text-warning fa-2x"></i>  // Ícono más grande
                                            ) : (
                                                <i className="fa-regular fa-heart text-warning fa-2x"></i>  // Ícono más grande
                                            )}
                                        </button>
                                    }
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <i className="icon fa-solid fa-circle-arrow-left ml-1"></i>
                                <Link to={`/movie/${movieId}`} className="yellow ml-2">
                                    GO BACK
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        <div className="photo col-md-3">
                            <div className="card mt-4 mb-2">

                                <img
                                    className="card-img-top"
                                    src={imageUrl}
                                    alt={directorDetail?.name}
                                />
                            </div>
                            <h5><strong> Department: </strong> {directorDetail?.known_for_department}</h5>
                            <h5><strong> Birthday: </strong> {formattedBirthDate || 'No information available'}</h5>
                            <h5><strong> Born in: </strong> {directorDetail?.place_of_birth || 'No information available'}</h5>
                            {formattedDeathDate && <h5><strong>Date of death: </strong> {formattedDeathDate}</h5>}
                        </div>


                        <div className="biography col-md-9 d-flex flex-column text-justify">
                            <h4><strong> Biography:  </strong></h4>
                            <p>{directorDetail?.biography || 'No information available'} </p>
                        </div>
                    </div>




                </div>
            )}
        </div>
    );
};
