const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3800, () =>
      console.log("Server Running at http://localhost:3300/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
const convertMovieObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorID: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};
const convertdirectorObjectToResponseObject = (dbObject) => {
  return {
    
    directorID: dbObject.director_id,
    directorname: dbObject.director_name,
   
  };
};


initializeDbAndServer();

//get movie names api 1
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie;`;
 
   const movieArray = await database.all(getMoviesQuery);
  response.send(
    movieArray.map((eachMovie) =>
      convertMovieObjectToResponseObject(eachMovie)
    )
  );
  });
//get directorsapi 6

app.get("/directors/", async (request, response) => {
  const getdirectorQuery = `
    SELECT
      *
    FROM
      Director;`;
 
   const directorArray = await database.all(getdirectorQuery);
  response.send(
    directorArray.map((eachdirector) =>
      convertdirectorObjectToResponseObject(eachdirector)
    )
  );
  });

//API3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `SELECT 
      * 
    FROM 
      movie
    WHERE 
      movie_id= ${movieId};`
    
  const movie = await database.get(getMovieQuery);
  response.send(convertMovieObjectToResponseObject(movie));
});
//api5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `delete
      * 
    FROM 
      movie
    WHERE 
      movie_id= ${movieId};`
    
  const movie = await database.get(getMovieQuery);
  response.send("Movie Removed");
});
//api2
app.post("/movies/", async (request, response) => {
  const { movieId,  directorID,leadActor } = request.body;
  const postmovieQuery = `
  INSERT INTO
    movie (movie_id, director_id, lead_Actor)
  VALUES
    ('${movieId}', ${directorID}, '${leadActor}');`;
  const movieadd = await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});
//api7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieQuery = `SELECT 
      * 
    FROM 
      director innerjoin movie on director.director_id=movie.director_id
    WHERE 
     director.director_id = ${directorId};`
    
  const movie = await database.get(getMovieQuery);
  response.send(convertMovieObjectToResponseObject(movie));
});
//api4
app.put("/movies/:movieId/",async(request,response)=>{
   const { movieId,  directorID,leadActor } = request.body;
  const postmovieQuery = `
   UPDATE
    movie
  SET
    movie_id = '${movieId}',
    director_id = ${directorID},
    lead_actor = '${leadActor}'
  WHERE
    movie_id = ${movieId};`;
  const movieadd = await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
})

module.exports=app