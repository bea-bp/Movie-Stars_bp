import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/ActorDetail.css";
import { useParams, Link } from "react-router-dom";
import no_image from "../../img/no_image.png";

export const ActorDetail = () => {
    const { store, actions } = useContext(Context);
    const { actorId, movieId } = useParams();
    const [actorDetail, setActorDetail] = useState(null);
    const [actorMovies, setActorMovies] = useState([]);

    const birthDate = actorDetail?.birthday ? new Date(actorDetail?.birthday) : null;
    const formattedBirthDate = birthDate ? birthDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "";
    
    const deathDate = actorDetail?.deathday ? new Date(actorDetail?.deathday) : null;
    const formattedDeathDate = deathDate ? deathDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "";
    
    const imageUrl = actorDetail?.profile_path
        ? `https://image.tmdb.org/t/p/w500${actorDetail?.profile_path}`
        : no_image;
    
        useEffect(() => {
            actions.getActorById(actorId).then(actor => {
                setActorDetail(actor);
                actions.getMoviesByActor(actorId).then(movies => {
                    setActorMovies(movies);
                });
            });
        }, [actorId]);
    
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mb-1">
                        <h1>{actorDetail?.name}</h1>
    
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
        );
    };
    