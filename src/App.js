import React from 'react';

import Login from './userLogin';
import Register from './userRegister';
import Navbar from "./pages/Navbar"
import Home from "./pages/Home"
import AboutUs from "./pages/AboutUs"
import Quiz from "./pages/components/Quiz"
import {QuizProvider} from "./pages/context/quiz"
import PrevQueues from "./pages/prevQueues"
import Watchlist from "./pages/watchlist"
import Random from "./pages/random"
import TopMovies from "./pages/topMovies"
import Reccom from './pages/components/Recommendations';

import {Route, Routes} from "react-router-dom";
import { RequireAuth } from 'react-auth-kit';

class App extends React.Component {
  //initialize an object's state in a class
   constructor(props) {
     super(props)
       this.state = {
        }
       }

       render() {
        return (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/about" element={<AboutUs />}></Route>
              <Route path="/quiz" element={<QuizProvider><Quiz /></QuizProvider>}></Route>
              <Route path="/prevQueues" element={<RequireAuth loginPath="/login"><PrevQueues /></RequireAuth>}></Route>
              <Route path="/watchlist" element={<RequireAuth loginPath="/login"><Watchlist /></RequireAuth>}></Route>
              <Route path="/topMovies" element={<TopMovies/>}></Route>
              <Route path="/random" element={<Random/>}></Route>
              <Route path = "/login" element = {<Login/>} />
              <Route path = "/register" element = {<Register/>} />
              <Route path = "/results" element = {<QuizProvider><Reccom /></QuizProvider>} />
            </Routes>
            </> 
        
    );
}
}

export default App;

