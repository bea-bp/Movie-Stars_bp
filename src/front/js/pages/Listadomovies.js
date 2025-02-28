import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/Listadomovies.css";
import { Link } from 'react-router-dom';
import no_image from "../../img/no_image.png";
import { Spinner } from "../component/Spinner";

export const Listadomovies = ({ searchQuery }) => {
	const { store, actions } = useContext(Context);
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		actions.getMovies(searchQuery).then(() => {
			setMovies(store.movies);
			setLoading(false)
		});
	}, [searchQuery]);



	return (
		<div>
			{loading ? (
				<Spinner />
			) : (
				<div className="container">
					<div className="row">
						<h5 className="to-watch">Suggested Movies To Watch:</h5>
						{movies.map((movie, i) => (

							<div className="col-md-2" key={i}>
								<Link to={`/movie/${movie.id}`}>
									<div className="card mt-5">
										<div className="star-ranking">
											<i className="fa fa-star star-icon"></i>
											<span className="ranking">{movie?.ranking.toFixed(1)}</span>
										</div>
										<img className="card-img-top" src={movie.image ? `https://image.tmdb.org/t/p/w500${movie.image}` : no_image} alt="Poster Movie" />
									</div>
									<p className="title">{movie.name}</p>
								</Link>
							</div>

						))}
					</div>
				</div>
			)}
		</div>
	);
};