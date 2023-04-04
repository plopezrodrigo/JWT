import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

import "../../styles/home.css";


export const Signup = () => {
	const [formData, setFormData] = useState({tipo:"customer"});
	const [mensaje, setMensaje] = useState(null);
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);

	const handleChange = (evento) =>{
		setFormData({...formData, [evento.target.name]: evento.target.value});
	} 

	const handleSubmit = (evento)=>{
		evento.preventDefault(); // para evitar la recarga ya que cancela el evento

		if (formData["subscription"]){
			setFormData({...formData, "subscription": (formData["subscription"]=='on')});
		}

		fetch(process.env.BACKEND_URL + "/api/signup", 
			{method: 'POST',
			headers:{"Content-Type": "application/json"},
			body: JSON.stringify(formData),
			})
		.then(response => {
			if (response.status == 200){ 
				navigate("/login")
			}else{ 
				setMensaje(response["msg"])
			}
			return response.json();
		})
	}

	useEffect(()=>{
		if (store.token && store.token != "" && store.token != undefined) {
			navigate.push("/login");
		}
	  },[]);

	return (
		<div className="vh-100 gradient-custom">
		  <div className="container text-center">
			<div className="row d-flex justify-content-center align-items-center h-100">
			  <h3>¡Hola de nuevo!</h3>
			  <p className="mb-3">Bienvenido a tu App para valorar establecimientos</p>
			<div className="col-12 col-md-8 col-lg-6 col-xl-5">
				<div className="card px-3" id="card">
					<form className="form-outline" onSubmit={handleSubmit}>
							<div className="form-group">
								<label className="alinear-izquierda mt-3 ms-2" htmlFor="InputEmail1">Dirección de correo electrónico</label>
								<input type="email" name="email" required className="form-control mb-2" id="InputEmail1" aria-describedby="emailHelp" onChange={handleChange} />
							</div>
							<div className="form-group">
								<label className="alinear-izquierda mt-3 ms-2" htmlFor="InputPassword1">Crear contraseña</label>
								<input type="password" name="password" required className="form-control mb-2" id="InputPassword1"  onChange={handleChange} />
							</div>
							<br/>
							<div className="form-check">
                      		<input  className="form-check-input"
                              type="checkbox"
                              value=""
                              id="invalidCheck"
                              required
                      		/>
                      		<label className="form-check-label"> Confirmo que he leido y acepto la Política de Privacidad y Aviso Legal.</label>
                      		<div className="invalid-feedback">Por favor, confirma que has leido y aceptas la Política de Privacidad y Aviso Legal.</div>
                      		</div>
							<button className="mb-3 col-md-12 btn-lg px-5 mb-3 mt-3" type="submit"  id="button">Registrarme</button>
							{(mensaje != null) && <p>{mensaje}</p>}
							<div>
                      		<p className="ms-3 me-3 mb-3 text-center">
                      		¿Ya tienes una cuenta?
                     		 <p className="ms-3 me-3 mt-3 text-center">
                      		<Link to="/login">
                      		<strong className="strong "> Inicia sesión </strong>
                      		</Link>
                      		</p>
                    		</p>
                  			</div>
					</form>	
				</div>								  
			</div>
			</div>
		  </div>
		</div>
	  );
};