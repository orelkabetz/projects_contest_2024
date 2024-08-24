const express = require('express');
const { usersSerivce } = require('./users.service');
const router = express.Router();
const { getCollections } = require('../../DB/index');

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
    const userRes = usersSerivce.addId("/add-id", token, ID);

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
    // admin logic
  } else if (user?.type === "judge") {
    // judge logic
  }
  // kick them out
})

router.post('/check-token', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await usersSerivce.checkToken(token);
    if (!user) {
      return res.json({
        success: false,
        error: "Failed to auth"
      });
    }
    const userToReturn =  { type: user.type, name: user.name };
    res.json({ success: true, user: userToReturn });
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

router.post('/preferences/add', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferenceId } = req.body;
    const result = await usersSerivce.addPreference(user.id, preferenceId);

    if (result.success) {
      res.json({ success: true, message: 'Preference added successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error adding preference:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/preferences/remove', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferenceId } = req.body;
    const result = await usersSerivce.removePreference(user.id, preferenceId);

    if (result.success) {
      res.json({ success: true, message: 'Preference removed successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error removing preference:', error);
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


router.post('/user/updateField', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { field,newValue } = req.body;
    const result = await usersSerivce.updateUserField(user.id, field,newValue);

    if (result.success) {
      res.json({ success: true, message: 'saved successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error saving field:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// Assuming getCollections is defined elsewhere and returns a promise with the collections
getCollections()
  .then((collections) => {
    const projectsJudgesGroupsDB = collections.projects_judges_groups;
    const projectsDB = collections.project_schemas;

    router.get('/projectsForJudge/projectList', async (req, res) => {
      try {
        // Verify and decode the token to get the user information
        const token = req.headers.authorization.split(' ')[1];
        const user = await usersSerivce.checkToken(token);

        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch the relevant project_ids from the projects_judges_groups collection
        console.log('fetching from projectsJudgesGroupsDB: ', user.id)
        const groupRecords = await projectsJudgesGroupsDB.find(
          { judge_ids: user.id },
          { projection: { project_ids: 1 } }
        ).toArray();
        console.log(groupRecords)
        // Extract project_ids from the groupRecords
        const projectIds = groupRecords.map(record => record.project_id);

        // Fetch the projects related to these project_ids
        const projects = await projectsDB.find(
          { _id: { $in: projectIds } },
          { projection: { Title: 1, WorkshopId: 1, _id: 1 } }
        ).toArray();        

        res.json(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
      }
    });
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });




module.exports = router;
