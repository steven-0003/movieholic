import React, {useState, useEffect} from 'react';
import "./styles.css";
import Cookies from 'js-cookie';
import Axios from 'axios';

export default function PrevQueues() {
  const [results, setResults] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    const cookieEmail = Cookies.get("_auth_state")
    let email;
    if (cookieEmail) {email = Cookies.get("_auth_state").replace(/['"]+/g, '')}
    Axios.post(`${window.location.protocol}//${window.location.hostname}:${process.env.port || 5000}/users/prevQueues`, {
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
             <h1 className = "message"> Please wait some time.... </h1> </div>

  if(isLoaded){
    if(results.length === 0) return <div>
    <h1 className = "message"> You have not been recommended any movies yet </h1> </div>
  }


const items = []
  
if(results.length > 0){
  let noOfItems = Math.ceil(results.length/5);
  for(let i = 0; i<noOfItems; i++){
    let subResults = results.slice((5*i), (5*i) + 5)
    items.push(<CustomMovie key = {i} id = {i} subitems = {subResults}>Item {i+1}</CustomMovie>)
  }
}

return(
  <div className = "p-container">
    {items}
  </div>
)
}



function CustomMovie({id, children, subitems, ...props}){
    return (
        <div className="item">
            <div className="sub-item title">{children}</div>
            {subitems.map((subitem) => (
              <div key = {subitem.movieID}>
                <div className="sub-item poster">
                <img
                    className="sub-item poster"
                    src = {`https://image.tmdb.org/t/p/original${subitem.poster_path}`}
                    onError = {({currentTarget}) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "image_not_found.jpg";
                    }}
                    alt = {subitem.name}
                  />
                </div>
              </div>
            ))}
        </div>
    ) 
}
