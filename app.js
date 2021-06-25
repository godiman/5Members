// import express
const express = require('express');

// Import dotenv
require('dotenv').config();

// Import body parser
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

// Import route
const indexRoute = require('./src/routes/index');
const stuRoute = require('./src/routes/studentRoute');
const adminRoute = require('./src/routes/superRoute');
const lectRoute = require('./src/routes/lecturerRoute');

const port = process.env.APP_PORT;

// Define the path
const path = require('path');

const app = express();
// define the app port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));

// Define template engine
app.set('view engine', 'ejs');

// Point to public folder
const asset_dir = path.join(__dirname, './public'); 
app.use(express.static(asset_dir));
/* //Point to public folder */  
app.use(cookieParser());

// app uses the index route
app.use('', indexRoute);
app.use('', stuRoute);
app.use('', adminRoute);
app.use('', lectRoute);

app.listen(port, () =>{
    console.log('App is listening on port: ', port,'\n', 'http://localhost:5000');
})

