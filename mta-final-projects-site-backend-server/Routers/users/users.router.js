const express = require('express');
const { usersSerivce } = require('./users.service');
const router = express.Router();

// Assuming you have a separate module for handling login and registration

router.post('/login', async (req, res) => {
 try {
  const { userID, password } = req.body;
  const userRes = await usersSerivce.checkLoginDetails(userID, password);

  // More sophisticated logic can be added here to handle login
  res.json(userRes);
 } catch (error) {
  console.log(error);
 }
});

router.post('/add-id', async (req, res) => {
  try {
   const { token, ID } = req.body;
   const userRes = await usersSerivce.addId("/add-id", token, ID);
 
   // More sophisticated logic can be added here to handle login
   res.json(userRes);
  } catch (error) {
   console.log(error);
  }
 });

router.post('/registerFullInfo', (req, res) => {
  const { userID, fullName, email, type, password } = req.body;
  usersSerivce.registerNewUserWithFullDetails(userID, fullName, email, type, password);
  // More sophisticated logic can be added here to handle registration
  res.json("Registration successful or error message");
});






module.exports = router;