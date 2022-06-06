/* This is importing the packages we need to run the server. */
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

/* This is setting the port and the mongoDB URI. */
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";

/* This is creating an instance of the express server. */
const app = express();

/* This is a middleware that logs the request method, URL, and status code of the request. */
app.use(logger("dev"));

/* This is middleware that is parsing the data that is being sent to the server. */
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* This is telling the server to use the public folder as the static folder. */
app.use(express.static("public"));

/* This is connecting the server to the mongoDB database. */
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: true
});


/* This is telling the server to use the api.js file as the route for the server. */
app.use(require("./routes/api.js"));

/* This is telling the server to listen on the port that is set in the PORT variable. */
app.listen(PORT, () => {
  console.log(`App open on port ${PORT}!`);
});