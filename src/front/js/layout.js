import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { SignIn } from "./pages/SignIn";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Login } from "./pages/Login";
import { Listadomovies } from "./pages/Listadomovies.js";
import { Movie } from "./pages/Movie";
import { ActorDetail } from "./pages/ActorDetail";
import { PassRecovery } from "./pages/passRecovery";
import { PassChange } from "./pages/passChange";
import { Footer } from "./pages/Footer";
import { Navbar } from "./pages/Navbar";
import { DirectorDetail } from "./pages/DirectorDetail";
import { Favorites } from "./pages/Favorites";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    const [searchQuery, setSearchQuery] = useState('');


    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar onSearchChange={setSearchQuery} />
                    <Routes>
                        <Route element={<Listadomovies searchQuery={searchQuery} />} path="/" />
                        <Route element={<Movie />} path="/movie/:movieId" />
                        <Route element={<ActorDetail />} path="/:movieId/actors/:actorId" />
                        <Route element={<DirectorDetail />} path="/:movieId/directors/:directorId" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<SignIn />} path="/sign-up" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<PassRecovery />} path="/pass-recovery" />
                        <Route element={<PassChange />} path="/pass-change" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
