import React, {useState, useEffect} from "react";
import Slider from "../../slider";
import Axios from "axios";
import Cookies from "js-cookie";

function Reccom(){
    let query = "SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID WHERE 1 ";
    let quizquery = "";
    let totalAnswers = window.sessionStorage.getItem("totalAnswers").split(",");

    const [results, setResults] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    
    //q1
    if (totalAnswers[0] === 'Rom-Com'){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10749) AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 35) ";
    }else if (totalAnswers[0] === 'Comedy'){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 35) ";
    }else if (totalAnswers[0] === 'Horror'){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 27) ";
    }else if (totalAnswers[0] === 'Action'){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 28) ";
    }

      //q2 (no need to add an sql statement for not important)
    if (totalAnswers[1] === "10-8 (Very)"){
        quizquery += "AND movies.revenue >= 100000000 ";
    }else if (totalAnswers[1] === "7-5 (it matters)"){
        quizquery += "AND movies.revenue >= 50000000 ";
    }else if (totalAnswers[1] === "5-3 (just a little bit)"){
        quizquery += "AND movies.revenue >= 25000000 ";
    }
    
    //q3
    if (totalAnswers[2] === "Animated"){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 16) ";
    }else if (totalAnswers[2] === "Musical"){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10402) ";
    }else if (totalAnswers[2] === "Live action"){
        quizquery += "AND movies.movieID NOT IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 16) ";
    }else if (totalAnswers[2] === "Documentary"){
        quizquery += "AND movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 99) ";
    }
    
    //q5 (no need for sql for neutral)
    if (totalAnswers[4].toLowerCase() === "happy"){
        quizquery += "AND (movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 16) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 35) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 12) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10749) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10751)) ";   //animation,comedy,adventure,romance,family
    }else if (totalAnswers[4].toLowerCase() === "sad"){
        quizquery += "AND (movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 35) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10402) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10749) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10751) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 16)) ";   //comedy,music,romance,family,animation
    }else if (totalAnswers[4].toLowerCase() === "angry"){
        quizquery += "AND (movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 27) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 18) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 28) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 53) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 80) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 10752) OR movies.movieID IN (SELECT movieGenres.movieID FROM movieGenres WHERE movieGenres.genreID = 9648)) ";   //horror,drama,action,thriller,crime,war,mystery
    }
    
    //q7
    if (totalAnswers[6] === "English"){
        quizquery += "AND movies.language = 'en' ";
    }else if (totalAnswers[6] === "Spanish"){
        quizquery += "AND movies.language = 'es' ";
    }else if (totalAnswers[6] === "French"){
        quizquery += "AND movies.language = 'fr' "
    }else if (totalAnswers[6] === "German"){
        quizquery += "AND movies.language = 'de' "
    }
    
    //q8 (no need for doesnt matter)
    if (totalAnswers[7].toLowerCase() === "less than 90 minutes"){
        quizquery += "AND movies.length <= 90 "
    }else if (totalAnswers[7].toLowerCase() === "less than 105 minutes"){
        quizquery += "AND movies.length <= 105 "
    }else if (totalAnswers[7].toLowerCase() === "less than 120 minutes"){
        quizquery += "AND movies.length <= 120 "
    }
    
    query += quizquery;
    query += "GROUP BY movies.movieID ORDER BY RAND() LIMIT 5";
    
    useEffect(() => {
        Axios.post("http://localhost:5000/database/recommendations",{
            query: query
        }).then((response) => {
            if(response.data.message){
                Axios.get("http://localhost:5000/database/5random").then((res) => {
                    if(res){
                        setResults(res.data);
                        setIsLoaded(true);
                    }else{
                        setResults('');
                    }
                }).catch(err => console.log(err));
            }else{
                setResults(response.data);
                if (response.data.length < 5){
                    Axios.get(`http://localhost:5000/database/random/${5 - response.data.length}`).then((res) => {
                        if(res){
                            setResults(results => [...results, ...res.data]);
                        }
                    }).catch(err => console.log(err));
                }
                setIsLoaded(true);
            }
        }).catch(err => console.log(err));
    }, [query])
    
    function addToReccom(id){
        Axios.defaults.withCredentials = true;
        const cookieEmail = Cookies.get("_auth_state")
        let email;
        if (cookieEmail) {email = Cookies.get("_auth_state").replace(/['"]+/g, '')}
        Axios.post("http://localhost:5000/database/addRecommendation", {
            email: email,
            movieID: id,
        }).catch(err => console.log(err));
    };

    if (!isLoaded) return <div>
             <h1> Please wait some time.... </h1> </div>

    if(isLoaded){
        results.map((result) => {
            return addToReccom(result.movieID);
        })
    }
    
    return(
        <div>
            <Slider slides = {results} />
        </div>
    )
}

export default Reccom