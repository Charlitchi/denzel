const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const IMBD = require("./src/imdb");
const ObjectId = require("mongodb").ObjectID;

const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://firstUser:user@moviecluster-scowa.gcp.mongodb.net/test?retryWrites=true";

const DATABASE_NAME = "moviesDB";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("movies");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});


app.get("/movies/populate", async (request, response) => {
    const movies = await IMBD(DENZEL_IMDB_ID);
    collection.insert(movies, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var messageToSend = { "total":result.length }
        response.send(messageToSend);
    });

});
