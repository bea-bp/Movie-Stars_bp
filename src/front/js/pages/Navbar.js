import React, { useContext, useEffect, useState } from "react";
import Moviestar from "../../img/Moviestar.png";
import "../../styles/Navbar.css";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useJwt } from "react-jwt";

export const Navbar = ({ onSearchChange }) => {
  const { store, actions } = useContext(Context);
  const [favorites, setFavorites] = useState([])
  const navigate = useNavigate();
  const logged = store.logged;
  const [searchValue, setSearchValue] = useState("");

  
  const handleLogout = () => {
    actions.logout();
    navigate("/");
  };

  const handleSearch = () => {
    onSearchChange(searchValue.toLowerCase());
  };
  
  const token = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt(token);
  let userId = null;
  if (token) {
    if (decodedToken && !isExpired) {
      userId = decodedToken.sub;
    }
  };

  const handleFavoritesClick = async () => {
    if (userId) {
      const userFavorites = await actions.getFavorites(userId);
      const combinedNames = [
        ...userFavorites.actors.map(actor => actor.name),
        ...userFavorites.directors.map(director => director.name),
        ...userFavorites.movies.map(movie => movie.name)
      ];
      setFavorites(combinedNames)
    }
  };

  useEffect(() => {

    handleFavoritesClick();
    // const favorites = JSON.parse(localStorage).getItem ("favorites") || []

  }, [userId]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div id="custom-navbar" className="container-fluid">
        <Link to={"/"} id="logo" className="navbar-brand" ><img id="imagenb" src={Moviestar} /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">

        </button>
        <div id="search-container">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search for a movie..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                  handleSearch();
              }
          }}
          />
          
          <button 
            className="btn bg-light" 
            id="search-button"
            onClick={handleSearch}>
              <i className="fas fa-search text-black bg-light"></i>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">


            {!token ? (<li className="nav-item">
              <Link to={"/login"} className="nav-link text-white">Log in</Link>
            </li>)
              :

              (<div className="d-flex align-items-center">
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link text-white btn">Sign Off</button>
                </li>

                <div className="dropdown dropstart mx-4">
                  <button
                    onClick={handleFavoritesClick}
                    className="btn btn-warning dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Favorites
                  </button>

                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {favorites.map((fav) => (
                      <li key={fav.id}><a className="dropdown-item" href="#">{fav}</a></li>
                    ))}
                  </ul>

                </div>

              </div>
              )}


          </ul>
        </div>
      </div>
    </nav>

  );
};


