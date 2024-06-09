const express = require('express');
const { usersSerivce } = require('./users.service');
const { fetchJudges } = require('../../DB/index');
const router = express.Router();

// Assuming you have a separate module for handling login and registration

router.post('/login', async (req, res) => {
  try {
    const { userID, password } = req.body;
    const userRes = await usersSerivce.checkLoginDetails(userID, password);

    if (userRes.success) {
      res.json(userRes);
    } else {
      res.json({ success: false, error: userRes.error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Server error' });
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

router.post('/registerFullInfo', async (req, res) => {
  const { userID, fullName, email, type, password } = req.body;
  try {
    const result = await usersSerivce.registerNewUserWithFullDetails(userID, fullName, email, type, password);
    if (result.success) {
      res.json({ success: true, message: 'Registration successful' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post("/example-guarded-data", async (req, res) => {
  const { token } = req.body;
  const user = await usersSerivce.checkToken(token);
  if (user?.type === "admin") {
    // admmin shit
  } else if (user?.type === "judge") {
    // judge shit
  }
  // kick them out
})

router.post('/check-token', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await usersSerivce.checkToken(token);
    if (!user) {
      return {
        success: false,
        error: "Failed to auth"
      }
    }
    const userToReturn =  {type: user.type, name: user.name} 
    res.json({success:true, user: userToReturn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
router.get('/preferences/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const userPreferences = await usersSerivce.getUserPreferences(user.id);
    res.json(userPreferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/preferences', async (req, res) => {
  try {
    const preferences = await usersSerivce.getPreferences();
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/preferences/save', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferences } = req.body;
    const result = await usersSerivce.savePreferences(user.id, preferences);

    if (result.success) {
      res.json({ success: true, message: 'Preferences saved successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});



module.exports = router;