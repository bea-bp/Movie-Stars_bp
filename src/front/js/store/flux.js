import Swal from 'sweetalert2'
import { useJwt } from "react-jwt";


const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			logged: false,

			movies: [],
			movie: null,
			actor: null,
			director: null,
		},

		actions: {

			// Use getActions to call a function within a fuction

			passchange: async (form) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/pass-change`
				console.log(form, apiUrl)
				const token = JSON.parse(localStorage.getItem("token"))
				try {
					const res = await fetch(apiUrl, {
						method: "PATCH",
						headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
						body: JSON.stringify(form)
					})
					if (res.ok) {

						const data = await res.json()
						localStorage.setItem("token", data?.token)
						setStore({ logged: true })
						console.log(getStore().logged, "logged")
						Swal.fire({
							text: "Your password was successfully changed",
							icon: "success",
							background: "#333",
							iconColor: "#ECCE33",
							confirmButtonColor: "#ECCE33",
							color: "#ffffff",
							confirmButtonStyle: "#ECCE33",
						})
						return true
					} else {
						console.log("Password change failed", res.status)
						Swal.fire({
							text: "Passwords don't match",
							icon: "error",
							background: "#333",
							confirmButtonColor: "#ECCE33",
							color: "#ffffff",
							confirmButtonStyle: "#ECCE33",
						})
					} return false

				} catch (error) {
					console.error(error)
					const errorMessage = await error.text();
					Swal.fire({
						text: errorMessage, // Mostrar el mensaje de error al usuario
						icon: "error",
						background: "#333",
						confirmButtonColor: "#ECCE33",
						color: "#FFFFFF",
						confirmButtonStyle: "#ECCE33",
					});
					return false
				}
			},

			login: async (form) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/login`
				console.log(form)
				try {
					const res = await fetch(apiUrl, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(form)
					})
					if (res.ok) {
						const data = await res.json()
						localStorage.setItem("token", data?.token)
						setStore({ logged: true })
						console.log(getStore().logged, "logged")
						Swal.fire({
							text: "Login successfully",
							icon: "success",
							background: "#333",
							iconColor: "#ECCE33",
							confirmButtonColor: "#ECCE33",
							color: "#ffffff",
							confirmButtonStyle: "#ECCE33",
						})
						return true
					} else {
						console.log("login failed", res.status)
						Swal.fire({
							text: "Please, try again",
							icon: "error",
							background: "#333",
							confirmButtonColor: "#ECCE33",
							color: "#ffffff",
							confirmButtonStyle: "#ECCE33",
						})
						return false
					}

				} catch (error) {
					console.error(error)
					return false
				}
			},

			logout: () => {
				localStorage.removeItem("token")
				setStore({ logged: false })
			},

			signup: async (user) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/signup`
				console.log(user, apiUrl)
				try {
					const res = await fetch(apiUrl, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(user)
					})
					if (res.ok) {

						const data = await res.json()
						localStorage.setItem("token", data?.token)
						setStore({ logged: true })
						console.log(getStore().logged, "logged")
						Swal.fire({
							text: "SignIn successfully",
							icon: "success",
							background: "#333",
							iconColor: "#ECCE33",
							confirmButtonColor: "#ECCE33",
							color: "#ffffff",
							confirmButtonStyle: "#ECCE33",
						})
						return true
					} else {
						console.log("Signup failed", res.status)
						Swal.fire({
							text: "Please, try again",
							icon: "error",
							background: "#333",
							confirmButtonColor: "#ECCE33",
							color: "#ffffff",
							confirmButtonStyle: "#ECCE33",
						})
					} return false

				} catch (error) {
					console.error(error)
					return false
				}
			},


			validateToken: async () => {
				let token = localStorage.getItem("token")
				const apiUrl = `${process.env.BACKEND_URL}/api/validate`
				console.log(apiUrl, token)
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
					})
					if (res.ok) {
						const data = await res.json()
						console.log(data)
						setStore({ logged: true })
						return true;
					} else {
						console.log("Request failed", res.status)
						return false
					}
				} catch (error) {
					console.error(error)
					return false;
				}

			},


			getMovies: async (searchQuery) => {
				console.log(searchQuery)
				const apiUrl = `${process.env.BACKEND_URL}/api/movies?searchQuery=${searchQuery}`
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					})
					if (res.ok) {
						const data = await res.json()
						setStore({ movies: data })
						return data;
					} else {
						console.log("Request failed", res.status)
					}
				} catch (error) {
					console.error(error)
					return null;
				}
			},

			getMovieById: async (movieId) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/movies/${movieId}`
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					})
					if (res.ok) {
						const data = await res.json()
						setStore({ movie: data })
						console.log(data);
						return data;
					} else {
						console.log("Request failed", res.status)
					}
				} catch (error) {
					console.error(error)
					return null;
				}
			},

			getActorById: async (actorId) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/actors/${actorId}`;
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					});
					if (res.ok) {
						const data = await res.json();
						setStore({ actor: data });
						console.log(data);
						return data;
					} else {
						console.log("Request failed", res.status);
					}
				} catch (error) {
					console.error(error);
					return null;
				}
			},
			getDirectorById: async (directorId) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/directors/${directorId}`;
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					});
					if (res.ok) {
						const data = await res.json();
						setStore({ director: data });
						console.log(data);
						return data;
					} else {
						console.log("Request failed", res.status);
					}
				} catch (error) {
					console.error(error);
					return null;
				}
			},

			getMoviesByActor: async (actorId) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/actors/${actorId}/movies`;
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					});
					if (res.ok) {
						const data = await res.json();
						setStore({ movies: data }); // Store the movies of the actor
						console.log(data);
						return data;
					} else {
						console.log("Request failed", res.status);
					}
				} catch (error) {
					console.error(error);
					return null;
				}
			},



			addFavorite: async (element, userId) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/users/${userId}/favorites`;

				const token = localStorage.getItem("token");

				console.log(JSON.stringify(element))

				try {
					const response = await fetch(apiUrl, {
						method: "POST",
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(element)
					});

					if (response.ok) {
						console.log("Favorito agregado con éxito");
					} else {
						console.error("Error al agregar favorito", await response.text());
					}
				} catch (error) {
					console.error("Error en la petición:", error);
				}
			},


			getFavorites: async (userId) => {
				const token = localStorage.getItem("token");
				if (!token) return [];
				const apiUrl = `${process.env.BACKEND_URL}/api/users/favorites/${userId}`;
				try {
					const response = await fetch(apiUrl, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (response.ok) {
						const favorites = await response.json();
						return favorites;
					} else {
						console.error("Error al obtener favoritos", await response.text());
						return [];
					}
				} catch (error) {
					console.error("Error en la petición:", error);
					return [];
				}

			},

			isFavorite: async (id) => {
				const token = localStorage.getItem("token");
				if (!token) return [];
				const apiUrl = `${process.env.BACKEND_URL}/api/is_favorites/${id}`;
				try {
					const response = await fetch(apiUrl, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (response.ok) {
						const isFavorite = await response.json();
						return isFavorite;
					} else {
						console.error("Error al obtener favoritos", await response.text());
						return false;
					}
				} catch (error) {
					console.error("Error en la petición:", error);
					return false;
				}

			},

			deleteFavorite: async (favoriteId, favoriteType, userId) => {
				const apiUrl = `${process.env.BACKEND_URL}/api/users/${userId}/favorites/${favoriteType}/${favoriteId}`;
				const token = localStorage.getItem("token");
				try {
					const response = await fetch(apiUrl, {
						method: "DELETE",
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (response.ok) {
						console.log("Favorito eliminado con éxito");
					} else {
						console.error("Error al eliminar favorito", await response.text());
					}
				} catch (error) {
					console.error("Error en la petición:", error);
				}
			},

			load_data: () =>{
				var requestOptions = {
					method: 'GET',
					redirect: 'follow'
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/load_database`, requestOptions)
					.then(response => response.text())
					.then(result => console.log(result))
					.catch(error => console.log('error', error));
			}

		},
	};

};

export default getState;