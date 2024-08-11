import React, {useState} from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSignIn } from "react-auth-kit";

function Login(){
    console.log(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}`);
    const signIn = useSignIn();

    const [loginStatus, setLoginStatus] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        Axios.post(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/users/login/`,{
            email: email,
            password: password,
        }).then((response) => {
            if(response.data.message === "Wrong email or password"){
                setLoginStatus(response.data.message);
            }else{
                setLoginStatus(response.data.message);

                signIn({
                    token: response.data.token,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: email
                });
                window.location.pathname = "/";
            }
        })
    };

    return(
        <div className="login">
            <div className="login-item">
                <h1 className="login-title">Login</h1>
            </div>
            <div className="login-item">
                <label className="login-label">Email</label>
                <input 
                    type="text"
                    className="login-input" 
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
            </div>
            <div className="login-item">
                <label className="login-label">Password</label>
                <input 
                    type="password"
                    className="login-input"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
            </div>
            <div className="login-item">
                <button className="add-watchlist" onClick = {login}>Login</button>
            </div>
            <br></br>
            <div className="login-item">
                <Link className = "button-link" to = "/register">Sign up</Link>
            </div>
            <br></br>
            <div className="login-item">
                <h2>{loginStatus}</h2>
            </div>

            
        </div>
    )
}

export default Login