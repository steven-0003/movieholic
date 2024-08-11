import React, {useState} from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFlip } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/effect-flip";

const Slider = ({slides}) => {
  const [addStatus, setAddStatus] = useState('');;

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
          setAddStatus("Added to watchlist successfully");
        }
      }).catch((err) => {
        setAddStatus("Unable to add movie to watchlist");
      })
    };

    return (
      <Swiper
        modules={[Navigation, Pagination, EffectFlip]}
        spaceBetween={50}
        slidesPerView={1}
        effect={"flip"}
        grabCursor={true}
        pagination={true}
        navigation={true}
        className="mySwiper"
      >
        {slides.map((slide) => (
            <SwiperSlide key = {slide.movieID}>
                <div className="slider-container">
                  <div className="item poster">
                  <img
                    src = {`https://image.tmdb.org/t/p/original${slide.poster_path}`}
                    onError = {({currentTarget}) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "image_not_found.jpg";
                    }}
                    alt = {slide.name}
                  />
                  </div>
                    <div className="item information">
                      <div className="sub-item title">{slide.name}</div>
                      <div className="sub-item description">{slide.description}</div>
                      <div className="sub-item genres">Genres: {slide.movie_genres}</div>
                      <div className="sub-item rating">Rating: {slide.rating}</div>
                      <div className="sub-item release">Release year: {String(slide.release_date).substring(0,4)}</div>
                      <div className="sub-item"><button className = "add-watchlist" onClick={() => addToWatchList(slide.movieID)}>ADD TO WATCHLIST</button></div>
                      <div className="sub-item revenue">{addStatus}</div>
                    </div>
                </div>
            </SwiperSlide>
        ))}
        
      </Swiper>
    );
  };

export default Slider