import React, {useState, useEffect} from 'react';
import Axios  from 'axios';
import Cookies from 'js-cookie';

export default function Random() {
  const [addStatus, setAddStatus] = useState('');
  const [movies, setMovies] = useState('')
  const [isLoaded, setIsLoaded] = useState(false);

  const getRandom = () => {
    Axios.get(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/database/random`)
    .then((res) => {
        if(res){
            setMovies(res.data);
            setIsLoaded(true);
        }else{
            setMovies('');
        }
    })
    .catch(err => console.log(err));
  }
  
  useEffect(() => {
    getRandom()
  }, []);

  if (!isLoaded) return <div>
             <h1 className = "message"> Please wait some time.... </h1> </div>

  const addToWatchList = (id) => {
    Axios.defaults.withCredentials = true;
    const cookieEmail = Cookies.get("_auth_state")
    let email;
    if (cookieEmail) {email = Cookies.get("_auth_state").replace(/['"]+/g, '')}
    Axios.post(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/database/watchlist`,{
      email: email,
      movieID: id
    }).then((response) => {
      if(response.data.message){
        setAddStatus(response.data.message);
      } else{
        setAddStatus("Added to watchlist successfully")
      }
    }).catch((err) => {
      setAddStatus("Unable to add movie to watchlist")
    })
  };

  return (
    <>
    {movies.map((movie) => (
      <div key={movie.movieID}>
        <div className="slider-container">
                  <div className="item poster">
                  <img
                    src = {`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    onError = {({currentTarget}) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "image_not_found.jpg";
                    }}
                    alt = {movie.name}
                  />
                  </div>
                    <div className="item information">
                      <div className="sub-item title">{movie.name}</div>
                      <div className="sub-item description">{movie.description}</div>
                      <div className="sub-item genres">Genres: {movie.movie_genres}</div>
                      <div className="sub-item rating">Rating: {movie.rating}</div>
                      <div className="sub-item release">Release year: {String(movie.release_date).substring(0,4)}</div>
                      <div className='sub-item'><button className = "add-watchlist" onClick = {() => addToWatchList(movie.movieID)}>ADD TO WATCHLIST</button></div>
                      <div className="sub-item"><button className = "add-watchlist" onClick={getRandom}>GET ANOTHER RANDOM MOVIE</button></div>
                      <div className="sub-item revenue">{addStatus}</div>
                    </div>
                </div>
      </div>
    ))}
    </>
    
  )
}

