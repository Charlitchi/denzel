const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const IMBD = require("./src/imdb");
const Random = require("random-js").Random;
const ObjectId = require("mongodb").ObjectID;

const random = new Random()//MersenneTwister19937.autoSeed());



const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://firstUser:user@moviecluster-scowa.gcp.mongodb.net/test?retryWrites=true";

const DATABASE_NAME = "moviesDB";


var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collectionMovie, collectionReview;

app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collectionMovie = database.collection("movies");
        collectionReview = database.collection("reviews");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.get("/movies", (request, response) => {
    collectionMovie.find({ metascore: { $gt: 70 }}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var messageToSend = result[random.integer(0, result.length-1)]
        response.send(messageToSend);
    });

});

app.get("/movies/populate", async (request, response) => {
    const movies = await IMBD(DENZEL_IMDB_ID);
    collectionMovie.insert(movies, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
    collectionMovie.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var messageToSend = { "total":result.length }
        response.send(messageToSend);
    });

});


app.get("/movies/search", (request, response) => {
    var sendMetascore;
    var sendLimit;
    if (request.query.metascore !== undefined) {
      sendMetascore = +request.query.metascore;
    } else {
      sendMetascore = 0;
    }
    if (request.query.limit !== undefined) {
      sendLimit = +request.query.limit;
    } else {
      sendLimit = 5;
    }
    query = { "metascore" : { $gt: sendMetascore } };
    collectionMovie.find(query).limit(sendLimit).sort({ metascore: -1 }).toArray((error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      var messageToSend = result;
      response.send(messageToSend);
    });
});

app.get("/movies/:id", (request, response) => {
  console.log("Je suis dans le 1")
    collectionMovie.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// à revoir
app.post("/movies/:id", (request, response) => {
  console.log("Je suis dans le 2")
  console.log(request.body);
  var myquery = { "id": request.params.id };
  // {"date": "2019-03-04", "review": "😍 🔥"}
  var newvalues = { $set: {"date": "2019-03-04", "review": "Vachement bien"} };
  collectionMovie.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    response.send(res);
    db.close();
  });




  //  console.log(Object.keys(request.body));
  /*  collectionReview.insert( request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });*/
    response.send("ok")
});
