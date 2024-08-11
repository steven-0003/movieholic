import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import "./styles.css";

export default function TopMovies(){
  const [items, setItems] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Axios.get(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/database/topRated`)
    .then((res) => {
        if(res){
            setItems(res.data);
            setIsLoaded(true);
        }else{
            setItems('');
        }
    })
    .catch(err => console.log(err));
  }, [items]);

  if (!isLoaded) return <div>
             <h1 className='message'> Please wait some time.... </h1> </div>

  return (
    <div className="t-container">
        {items.map((item) => (
          <CustomReccom 
          key = {item.movieID} 
          imgPath = {item.poster_path}
          imgAlt = {item.name}
          num = {items.indexOf(item) + 1}
          >
            {item.name}
          </CustomReccom>
        ))}
    </div>
  )
}

function CustomReccom({id, num, children, imgPath, imgAlt, ...props}){
    return (
        <div className="item">
            <div className="sub-item">{num}</div>
            <div className="sub-item poster">
            <img className="sub-item poster"
                    src = {`https://image.tmdb.org/t/p/original${imgPath}`}
                    onError = {({currentTarget}) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "image_not_found.jpg";
                    }}
                    alt = {imgAlt}
                />
            </div>
            <div className="sub-item title">{children}</div>
        </div>
    ) 
}