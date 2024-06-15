const express = require('express');
const router = express.Router();
const { getCollections } = require('../../DB/index');

getCollections()
  .then((collections) => {
    // Remove selected IDs from the database
    router.post('/judges/remove-ids', async (req, res) => {
      const { ids } = req.body;
      try {
          const result = await collections.potential_users.deleteMany({ ID: { $in: ids } });
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
        const result = await collections.users.deleteMany({ ID: { $in: users } });
        res.json(result);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    router.get('/judges/judgesList', async (req, res) => {
      try {
        const judges = await collections.users.find({}, { projection: { name: 1, ID: 1} }).toArray();
        res.json(judges);
      } catch (error) {
        console.error('Error fetching judges:', error);
        res.status(500).json({ error: 'An error occurred while fetching judges' });
      }
    });

    router.get('/judges/potentialJudgesList', async (req, res) => {
      try {
        const potentialJudges = await collections.potential_users.find({}).toArray();
        res.json(potentialJudges);
      } catch (error) {
        console.error('Error fetching potential judges:', error);
        res.status(500).json({ error: 'An error occurred while fetching potential judges' });
      }
    });

    router.post('/judges/add-potential-judge', async (req, res) => {
      const { ID } = req.body;
      try {
          const result = await collections.potential_users.insertOne({ ID });
          res.json(result);
      } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'An error occurred' });
      }
  });

  // Route to get all preferences
  router.get('/preferences', async (req, res) => {
    try {
      const preferences = await collections.available_preferences.find({}).toArray();
      res.json(preferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ error: 'An error occurred while fetching preferences' });
    }
  });

  // Route to add a new preference
  router.post('/preferences/add', async (req, res) => {
    const { preference } = req.body;
    try {
      const result = await collections.available_preferences.insertOne({ ID: preference });
      res.json(result);
    } catch (error) {
      console.error('Error adding preference:', error);
      res.status(500).json({ error: 'An error occurred while adding the preference' });
    }
  });

  // Route to remove preferences
  router.post('/preferences/remove', async (req, res) => {
    const { preferences } = req.body;
    try {
      const result = await collections.available_preferences.deleteMany({ ID: { $in: preferences } });
      res.json(result);
    } catch (error) {
      console.error('Error removing preferences:', error);
      res.status(500).json({ error: 'An error occurred while removing the preferences' });
    }
  });
  })
  .catch((err) => {
    console.error('Error getting collections:', err);
  });

module.exports = router;
