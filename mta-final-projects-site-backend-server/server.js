const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
//const Login = require('./Login'); // Assuming your login logic is in a separate file

const app = express();
const port = process.env.PORT || 3001; // Set the port for the server to listen on
// Enable CORS for all requests This lets you run both tests server + front and communicate
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Routes
app.post('/login', (req, res) => {
  // Handle login request
  const { username, password } = req.body;
  // Call your login logic here
  // For example, you can call a function from your Login module
  //const loginResult = Login.login(username, password); // Assuming your login logic returns a result
  res.json("aaaa");
});

app.post('/register', (req, res) => {
  // Handle register request
  const { username, password } = req.body;
  
  // Call your register logic here
  // For example, you can call a function from your Login module
  //const registerResult = Login.register(username, password); // Assuming your register logic returns a result
  res.json("aaaa");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
