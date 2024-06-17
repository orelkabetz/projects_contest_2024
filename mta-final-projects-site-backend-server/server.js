const { google } = require('googleapis');
const UserDB = require('./DB/entities/user.entity');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require("./Routers/users/users.router");
const uploadRouter = require('./Routers/upload_csv');
const adminRouter = require('./Routers/users/admin.router');
const app = express();
const port = process.env.PORT || 3001; // Set the port for the server to listen on

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the user routesaaa
app.use(userRouter);

// Mount the admin router
app.use('/admin', adminRouter);

// Use the upload router
app.use('/upload', uploadRouter);

// Start and init the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});