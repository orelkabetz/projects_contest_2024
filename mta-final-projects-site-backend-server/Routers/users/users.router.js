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

router.post('/register', (req, res) => {
  const { userID, password } = req.body;
  usersSerivce.addNewUserToSheet(userID, password);
  // More sophisticated logic can be added here to handle registration
  res.json("Registration successful or error message");
});






module.exports = router;
