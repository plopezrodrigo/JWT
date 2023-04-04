const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			token: null,
			message: null,
		  },
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			syncTokenFromSessionStore: () => {
				const token = sessionStorage.getItem("token");
				console.log("Application just loaded, synching the session storage token");
				if (token && token != "" && token != undefined)
          		setStore({ token: token });
			},

			logout: () => {
				sessionStorage.removeItem("token");
				console.log("Login out");
				setStore({ token: null });

			},
			
			login: async (email, password) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};

				try{
					const resp = await fetch(process.env.BACKEND_URL + "/api/token",
                                  opts
          		);
          		if (resp.status !== 200) { return false; }
          		const data = await resp.json();

          		sessionStorage.setItem("token", data.token);
          		setStore({ token: data.token });

				return true;
				} catch (error) {
					console.error("There has been an error login in");
					return false;
				}
			},

			getMessage: () => {
				const store= getStore();
				const opts = {
					headers: {
						"Authorization": "Bearer" + store.token
					}
				};
				//fetching data form the backend
				fetch("https://3000-4geeksacade-reactflaskh-peh4sljq2er.ws-eu80.gitpod.io/api/hello", opts)
					.then(resp => resp.json())
					.then(data => setStore({ message: data.message }))
					.catch(error => console.log("Error loading message from the backend", error));
			},
		},
};
}
export default getState;
