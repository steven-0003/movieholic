import React from 'react'
import {Link} from "react-router-dom";
import "./styles.css"

import bookmark from './../images/bookmark.png'
import history from './../images/history.png'
import dice from './../images/dice.png'
import star from './../images/star.png'
import clapboard from './../images/clapboard.png'

export default function Home() {
  return (
    <div className="App">
      <div className="start">
        <p className="main-text start-text">START YOUR MOVIE RECOMMENDATION EXPERIENCE HERE</p>
        <img src={clapboard} width="400" height="400" alt=""></img>
        <Link to="/quiz" className="button-link start-button">START</Link>
      </div>
      <div className="sub-button">
        <p className="main-text">TAKE   A LOOK AT YOUR LIST OF MOVIES YOU WISH TO WATCH</p>
        <img src={bookmark} width="100" height="100" alt=""></img>
        <Link to="/watchlist" className="button-link">WATCHLIST</Link>
      </div>
      <div className="sub-button">
        <p className="main-text">OUR TOP RATED MOVIES THIS WEEK</p>
        <img src={star} width="120" height="120" alt=""></img>
        <Link to="/topMovies" className="button-link">TOP MOVIES</Link>
      </div>
      <div className="sub-button">
        <p className="main-text">ALL YOUR PREVIOUSLY RECOMMENDED QUEUES</p>
        <img src={history} width="100" height="100" alt=""></img>
        <Link to="/prevQueues" className="button-link">PREV RECOM</Link>
      </div>
      <div className="sub-button">
        <p className="main-text">GET A RANDOM MOVIE NOW</p>
        <img src={dice} width="150" height="150" alt=""></img>
        <Link to="/random" className="button-link">RANDOM</Link>
      </div>
    </div>
  )
}
