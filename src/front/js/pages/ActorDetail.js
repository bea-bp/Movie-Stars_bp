import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/ActorDetail.css";
import { useParams, Link } from "react-router-dom";
import no_image from "../../img/no_image.png";
import { useJwt } from "react-jwt";
import { Spinner } from "../component/Spinner";

export const ActorDetail = () => {

    const [loading, setLoading] = useState(true);
    const { store, actions } = useContext(Context);
    const { actorId, movieId } = useParams();
    const [actorDetail, setActorDetail] = useState(null);
    const [actorMovies, setActorMovies] = useState([]);

    const birthDate = actorDetail?.birthday ? new Date(actorDetail?.birthday) : null;
    const formattedBirthDate = birthDate ? birthDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";

    const deathDate = actorDetail?.deathday ? new Date(actorDetail?.deathday) : null;
    const formattedDeathDate = deathDate ? deathDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";

    const imageUrl = actorDetail?.profile_path
        ? `https://image.tmdb.org/t/p/w500${actorDetail?.profile_path}`
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
            await actions.deleteFavorite(actorId, "actors", userId);
        } else {
            if (actorDetail && actorId) {
                await actions.addFavorite({ actor_id: actorId, favorite_type: "actors" }, userId);
            }
        }
        setIsFavorite(!isFavorite); // Cambia el estado cuando se hace clic en el botón
        console.log(userId, actorId)
    };


    useEffect(() => {
        actions.getActorById(actorId).then(actor => {
            setActorDetail(actor);
            actions.getMoviesByActor(actorId).then(movies => {
                setActorMovies(movies);
                setLoading(false)

            });
        });
        const fetchInitialIsFavorite = async () => {
            if (userId) {
                const initialIsFavorite = await actions.isFavorite(actorId);
                setIsFavorite(initialIsFavorite);
            }
        };
        fetchInitialIsFavorite();

    }, [actorId, userId]);



    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mt-5 mb-1">
                            <div className="d-flex ">
                                <h1>{actorDetail?.name}</h1>

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
                                    alt={actorDetail?.name}
                                />
                            </div>
                            <h5><strong> Character: </strong> {actorDetail?.character}</h5>
                            <h5><strong> Department: </strong> {actorDetail?.known_for_department || 'No information available'}</h5>
                            <h5><strong> Birthday: </strong> {formattedBirthDate || 'No information available'}</h5>
                            <h5><strong> Born in: </strong> {actorDetail?.place_of_birth || 'No information available'}</h5>
                            {formattedDeathDate && <h5><strong>Date of death: </strong> {formattedDeathDate}</h5>}
                        </div>
                        <div className="biography col-md-9 d-flex flex-column text-justify">
                            <h4><strong> Biography:  </strong></h4>
                            <p>{actorDetail?.biography || 'No information available'}</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};



