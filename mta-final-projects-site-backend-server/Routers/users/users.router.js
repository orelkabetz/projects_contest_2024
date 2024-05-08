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

// Remove selected IDs from the database
router.post('/judges/remove-ids', async (req, res) => {
  const { ids } = req.body;

  try {
    // Make sure you have properly imported or defined the `collections` object
    const result = await collections.judges.deleteMany({ _id: { $in: ids } });
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Remove selected users from the database
router.post('/judges/remove-users', async (req, res) => {
  const { users } = req.body;

  try {
    // Make sure you have properly imported or defined the `collections` object
    const result = await collections.judges.deleteMany({ username: { $in: users } });
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;