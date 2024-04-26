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
  })
  .catch((err) => {
    console.error('Error getting collections:', err);
  });

module.exports = router;