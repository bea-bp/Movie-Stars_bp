import React, { Component, useContext } from "react";
import "../../styles/Footer.css";
import { Context } from "../store/appContext";

export const Footer = () =>{ 
  const {actions} = useContext(Context)

  async function handleClick(){
    await actions.load_data()
  }
  
  return(
	<footer className="footer">
  <div className="social-icons">
    <a href="https://github.com/agumanz" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
    <a href="https://github.com/bea-bp" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
    <a href="https://github.com/AugustoSchemberger" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
    <button className="btn" onClick={handleClick}><i className="fab-github"></i></button>
  </div>
  <p className="copyright">© 2023 Movie Star ★. All rights reserved.</p>
</footer>
);
}