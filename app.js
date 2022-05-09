const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
// Imports the route files we just created
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
// imports bodyparser so we can parse the json we send to our frontend
const bodyParser = require('body-parser');
const User = require('./models/User');

const express = require("express");
const app = express();

const passport = require('passport');

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// setting up some middleware for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport);

// creates the routes
app.use("/api/users", users);
app.use("/api/tweets", tweets);

// I think this is the splash
// I Think this is fine to delete but check this out if I run into bugs
// app.get("/", (req, res) => {
    // const user = new User({
    //     handle: "Jim",
    //     email: "jim@jim.jim",
    //     password: "cheeeese"
    // })
    // user.save()
//     res.send("Correct or no?");
// });

// Run server on localhost:5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
