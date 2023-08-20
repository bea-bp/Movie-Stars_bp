import Swal from 'sweetalert2'


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
				const apiUrl = `${process.env.BACKEND_URL}api/pass-change`
				console.log(form, apiUrl)
				const token = JSON.parse(localStorage.getItem("token")) 
				try {
					const res = await fetch(apiUrl, {
						method: "PATCH",
						headers: { "Content-Type": "application/json", "Authorization":`Bearer ${token}`},
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
				const apiUrl = `${process.env.BACKEND_URL}api/login`
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
				const apiUrl = `${process.env.BACKEND_URL}api/signup`
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
				const apiUrl = `${process.env.BACKEND_URL}api/validate`
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


			getMovies: async () => {
				const apiUrl = `${process.env.BACKEND_URL}api/movies`
				try {
					const res = await fetch(apiUrl, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					})
					if (res.ok) {
						const data = await res.json()
						console.log(data)
						setStore({ movies: data })
						console.log(getStore().movies);
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
				const apiUrl = `${process.env.BACKEND_URL}api/movies/${movieId}`
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
				const apiUrl = `${process.env.BACKEND_URL}api/actors/${actorId}`;
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
				const apiUrl = `${process.env.BACKEND_URL}api/directors/${directorId}`;
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

			// addNewLikedElement: (elementToAdd) => {
			// 	const likes = getStore().likes;
			// 	const updatedLikes = [...likes, elementToAdd];
			// 	window.localStorage.setItem("likes", JSON.stringify(updatedLikes));
			// 	setStore({ likes: updatedLikes });
			//   },
			
			//   removeLikedElement: (id) => {
			// 	const likes = getStore().likes;
			// 	const filtered = likes.filter((element) => element.id !== id);
			// 	window.localStorage.setItem("likes", JSON.stringify(filtered));
			// 	setStore({ likes: filtered });
			//   },
			
			//   isLikedElement: (id) => {
			// 	const likes = getStore().likes;
			// 	const likesId = likes.map((element) => element.id);
			// 	return likesId.includes(id);
			//   },
		
			addNewLikedElement: async (elementToAdd) => {
				// Puedes hacer un POST al endpoint para agregar un nuevo favorito
				const response = await fetch("URL_DEL_ENDPOINT_FAVORITOS", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(elementToAdd)
				});
			
				if (response.ok) {
					const updatedLikes = await response.json();
					setStore({ likes: updatedLikes });
				} else {
					// Manejar error
					console.error("Error al agregar favorito", await response.text());
				}
			},
			
			getLikedElements: async () => {
				// Puedes hacer un GET al endpoint para obtener todos los favoritos
				const response = await fetch("URL_DEL_ENDPOINT_FAVORITOS");
				if (response.ok) {
					const likes = await response.json();
					setStore({ likes });
				} else {
					// Manejar error
					console.error("Error al obtener favoritos", await response.text());
				}
			},
			
			removeLikedElement: async (id) => {
				// Puedes hacer un DELETE o POST con información especial al endpoint para remover un favorito
				const response = await fetch(`URL_DEL_ENDPOINT_FAVORITOS/${id}`, {
					method: "DELETE"
				});
			
				if (response.ok) {
					const updatedLikes = await response.json();
					setStore({ likes: updatedLikes });
				} else {
					// Manejar error
					console.error("Error al remover favorito", await response.text());
				}
			}



		}
	};
};

export default getState;