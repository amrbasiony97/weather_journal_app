// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 8000;

const server = app.listen(port, listening);

function listening() {
  console.log('Server running');
  console.log(`running on localhost: ${port}`);
}

// GET Route
app.post('/addData', (req, res) => {
  projectData.date = req.body.newDate;
  projectData.temp = req.body.temp;
  projectData.feelings = req.body.feelings;
  projectData.name = req.body.name;
  projectData.description = req.body.description;
  projectData.icon = req.body.icon;
  res.end()
})

// GET Route
app.get('/getResult', (req, res) => {
  res.send(projectData);
})