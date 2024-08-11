import React, {useState} from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

function Register(){
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [fnameReg, setFnameReg] = useState('');
    const [snameReg, setSnameReg] = useState('');

    const [registerStatus, setRegisterStatus] = useState('');

    const register = () => {
        Axios.post(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/users/register/`,{
            fname: fnameReg,
            sname: snameReg,
            email: emailReg,
            password: passwordReg,
        }).then((response) => {
            if(response.data.message){
                setRegisterStatus(response.data.message);
            }else{
                setRegisterStatus("Successfully registered")
            }
        })
    };

    return(
        <div className="login">
            <div className="login-item">
                <h1 className="login-title">Registration</h1>
            </div>
            <div className="login-item">
                <label className="login-label">Forename</label>
                <input 
                    type="text" 
                    className="login-input"
                    onChange={(e) => {
                        setFnameReg(e.target.value);
                    }}/>
            </div>
            <div className="login-item">
                <label className="login-label">Surname</label>
                <input 
                    type="text" 
                    className="login-input"
                    onChange={(e) => {
                        setSnameReg(e.target.value);
                    }}/>
            </div>
            <div className="login-item">
                <label className="login-label">Email</label>
                <input 
                    type="text"
                    className="login-input" 
                    onChange={(e) => {
                        setEmailReg(e.target.value);
                    }}/>
            </div>
            <div className="login-item">
                <label className="login-label">Password</label>
                <input 
                    type="text"
                    className="login-input"
                    onChange={(e) => {
                        setPasswordReg(e.target.value);
                    }} 
                />
            </div>  
            <div className="login-item">
                <button className = "add-watchlist" onClick = {register}>Register</button>
            </div>
            <div className="login-item">
                <Link className = "add-watchlist" to = "/login">Back to login</Link>
            </div>
            <br></br>
            <div className="login-item">
                <h2>{registerStatus}</h2>
            </div>        
        </div>
    )
}

export default Register