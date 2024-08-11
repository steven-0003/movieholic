import {Link} from "react-router-dom";
import logo from './../images/movieholic_logo.PNG';
import Cookies from "js-cookie";
import "./styles.css"
import { useSignOut } from "react-auth-kit";

export default function Navbar(){
    return <nav>
        <img src={logo} width="200" height="100" alt = ""></img>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Greeting />
          </li>
          
        </ul>
    </nav>
}

function Login(){
  return <a href="/login">Login</a>

}

function Logout(){
  const signOut = useSignOut();

  return <button onClick = {() => {
    signOut();
    window.location.pathname = "/"
  }}>Sign Out</button>
}

function Greeting(){
  const isAuth = (typeof Cookies.get("_auth_state") !==  "undefined");

  if(isAuth){
    return <Logout />
  } else{
    return <Login />
  }
}