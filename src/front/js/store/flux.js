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

			getMessage: async () => {
				try {
				  // fetching data from the backend
				  const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
				  const data = await resp.json();
				  setStore({ message: data.message });
				  // don't forget to return something, that is how the async resolves
				  return data;
				} catch (error) {
				  console.log("Error loading message from backend", error);
				}
			  },
		},
};
}
export default getState;
