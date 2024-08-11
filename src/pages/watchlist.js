import React, {useState, useEffect} from 'react'
import "./styles.css"
import Cookies from 'js-cookie';
import Axios from 'axios';

export default function Watchlist() {
  const [results, setResults] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    const cookieEmail = Cookies.get("_auth_state")
    let email;
    if (cookieEmail) {email = Cookies.get("_auth_state").replace(/['"]+/g, '')}
    Axios.post(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/users/watchlist`, {
      email: email
    }).then((response) => {
      if(response){
        setResults(response.data);
        setIsLoaded(true);
      }else{
        setResults('');
      }
    }).catch(err => console.log(err));
  }, []);

  if (!isLoaded) return <div>
             <h1 className='message'> Please wait some time.... </h1> </div>

if(isLoaded){
  if(results.length === 0) return <div>
  <h1 className = "message"> You have not added any movies to your watchlist yet </h1> </div>
}

  return (
    <div className="w-container">
        {results.map((result) => (
          <CustomTitle key = {result.movieID} id = {results.indexOf(result) + 1} poster = {result.poster_path} alt = {result.name}>{result.name}</CustomTitle>
        ))}
    </div>
  )
}

function CustomTitle({id,  children, poster, alt, ...props}){
    return (
        <div className="item">
            <div className="poster">
            <img
                    className="sub-item poster"
                    src = {`https://image.tmdb.org/t/p/original${poster}`}
                    onError = {({currentTarget}) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "image_not_found.jpg";
                    }}
                    alt = {alt}
                  />
            </div>
            <div className="title">{children}</div>
        </div>
    ) 
}