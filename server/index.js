const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

require('../src/auth/passport');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
    origin: function(origin, callback){
        return callback(null, true);
      }, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
}));
app.use(cookieParser());

dotenv.config();

const dbhost = process.env.DBHOST;
const user = process.env.USER;
const pass = process.env.PASS;
const db = process.env.DB;

if(ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../build')));
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    })
}

//MYSQL
const pool = mysql.createPool({
    connectionLimit : 100000,
    host : dbhost,
    user : user,
    password : pass,
    database : db
});

//Get all movies
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID GROUP BY movies.movieID", (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get some movies
app.get('/database/movieTest', passport.authenticate("jwt", {session: false}), (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID WHERE movies.movieID < 12 GROUP BY movies.movieID", (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get a movie by movie id
app.get('/:movieID', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID WHERE movies.movieID = ? GROUP BY movies.movieID", [req.params.movieID], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get the top rated movies
app.get('/database/topRated', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT * FROM movies ORDER BY rating DESC LIMIT 5", (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get a random movie
app.get('/database/random', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID GROUP BY movies.movieID ORDER BY RAND() LIMIT 1", (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get 5 random movies
app.get('/database/5random', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID GROUP BY movies.movieID ORDER BY RAND() LIMIT 5", (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get a number of random movies
app.get('/database/random/:no', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres INNER JOIN movies ON movies.movieID = movieGenres.movieID INNER JOIN genres ON genres.genreID = movieGenres.genreID GROUP BY movies.movieID ORDER BY RAND() LIMIT ?", [parseInt(req.params.no)], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});


//Get all users
app.get("/database/users", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        connection.query("SELECT * FROM customers", (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err:err})
            }
        });
    });
});

//Register a user
app.post('/users/register', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("INSERT INTO customers (fname, sname, email, custPassword) VALUES (?, ?, ?, SHA(?))", [params.fname, params.sname, params.email, params.password], (err, rows) => {
            connection.release(); //Return the connection to pool

            //Checking if the email already exists in the database
            if(err){
                if(err.errno = 1062){
                    res.send({message: "This email has already been registered"});
                }else{
                    res.send({message: "Failed to register"})
                }
            }else{
                res.send({message: "Successfully registered"})
            }
        
        });
    });
});

//User login
app.post('/users/login', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("SELECT * FROM customers WHERE email = ? AND custPassword = SHA(?)", [params.email, params.password], (err, rows) => {
            connection.release(); //Return the connection to pool

            
            if(err){
                res.send({err: err});
            }else{
                if (rows.length > 0) {
                    const jwtToken = jwt.sign({email: params.email}, "jwtS12345%*&skjvgh");

                    res.json({message: "Welcome back!", token: jwtToken})
                } else {
                    res.send({message: "Wrong email or password"});
                }
            }
        });
    });

});

//Find a user by email
app.post('/database/currentUser', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("SELECT customerID, fname, sname, email FROM customers WHERE email = ?", [params.email], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(err){
                res.send({err: err});
            }else{
                if (rows.length > 0) {
                   res.send(rows);
                } else {
                    res.send({message: "User not found"});
                }
            }
        });
    });
});

//Get previously recommended movies
app.post('/users/prevQueues', passport.authenticate("jwt", {session: false}), (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres, recommendations, movies, genres WHERE movies.movieID = movieGenres.movieID AND genres.genreID = movieGenres.genreID AND movies.movieID = recommendations.movieID AND recommendations.customerID IN (SELECT customers.customerID FROM customers WHERE customers.email = ?) GROUP BY movies.movieID", [params.email], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Get watchlist
app.post('/users/watchlist', passport.authenticate("jwt", {session: false}), (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("SELECT movies.*, GROUP_CONCAT(genres.genre SEPARATOR ', ' ) AS movie_genres FROM movieGenres, watchlist, movies, genres WHERE movies.movieID = movieGenres.movieID AND genres.genreID = movieGenres.genreID AND movies.movieID = watchlist.movieID AND watchlist.customerID IN (SELECT customers.customerID FROM customers WHERE customers.email = ?) GROUP BY movies.movieID", [params.email], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else {
                res.send({err: err});
            }
        });
    });
});

//Add to watchlist
app.post('/database/watchlist', passport.authenticate("jwt", {session: false}), (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("INSERT INTO watchlist (watchlist.customerID, watchlist.movieID) VALUES((SELECT customers.customerID FROM customers WHERE customers.email = ?), ?)", [params.email, params.movieID], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else{
                if(err.errno === 1062){
                    res.send({message: "Movie has already been added to watchlist"});
                }else{
                    res.send({err: err});
                }
                
            }
        });
    });
});

//Add to recommendations
app.post('/database/addRecommendation', passport.authenticate("jwt", {session: false}), (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query("INSERT INTO recommendations (recommendations.customerID, recommendations.movieID) VALUES((SELECT customers.customerID FROM customers WHERE customers.email = ?), ?)", [params.email, params.movieID], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(!err){
                res.send(rows);
            } else{
                if(err.errno === 1062){
                    res.send({message: "Movie has already been added to recommendations"});
                }else{
                    res.send({err: err});
                }
                
            }
        });
    });
});

//Get recommended movies based on quiz results
app.post('/database/recommendations', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        const params = req.body;

        connection.query(params.query, [params.query], (err, rows) => {
            connection.release(); //Return the connection to pool

            if(err){
                res.send({err: err});
            }else{
                if (rows.length > 0) {
                   res.send(rows);
                } else {
                    res.send({message: "No movies found"});
                }
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;