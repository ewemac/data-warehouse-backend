const express = require('express');
const app = express();
const mongoose = require('mongoose');
var cors = require('cors');
require('dotenv/config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//import Routes
const weatherRoute = require('./routes/weather');

app.use(cors());

//middleware
app.use('/weather', weatherRoute);


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true,useUnifiedTopology: true  },
    () => console.log('connected to DB')
);


//Start listening server
app.listen(3000);