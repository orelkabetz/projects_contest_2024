const express = require('express');
const { usersSerivce } = require('./users.service');
const router = express.Router();
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path


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
    router.get('/projectsForJudge/projectList', async (req, res) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await usersSerivce.checkToken(token);
    
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        console.log('fetching from projectsJudgesGroups: ', user.id);
        const query = { judge_ids: { $in: [user.id] } };
        const cursor = await collections.projects_judges_groups.find(query);
        const matchingProjectjudgesGroups = await cursor.toArray();
    
        const projectIds = [];
        for (const obj of matchingProjectjudgesGroups) {
          if (obj.project_ids && Array.isArray(obj.project_ids)) {
            obj.project_ids.forEach((projectId) => {
              if (!projectIds.includes(projectId)) {
                projectIds.push(projectId);  // Only push if not already exists
              }
            });
          }
        }
    
        console.log('projectIds:', projectIds);
    
        const projects = [];
        for (const projectId of projectIds) {
          const project = await collections.project_schemas.findOne({ ProjectNumber: projectId });
          if (project) {
            projects.push(project);
          }
        }
        res.json({'projects': projects});
      } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
      }
    });
    
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });

  getCollections()
  .then((collections) => {
    router.post('/gradeProject', async (req, res) => {
      try {
        // Verify the token and get the user info
        const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const user = await usersSerivce.checkToken(token);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }

        const judge_id = user.id; // Extract the judge's ID from the user object
        const grades = req.body; // Get the grades from the request body
        const projectId = req.query.projectId; // Get the project ID from the query string

        if (!projectId) {
          return res.status(400).json({ error: 'Project ID is required.' });
        }

        // Check if the grade already exists for this judge and project
        const existingGrade = await collections.grades.findOne({ judge_id, project_id: projectId });
        if (existingGrade) {
          return res.status(400).json({ error: 'Grade for this project already exists for this judge.' });
        }

        // Calculate the total grade
        const totalGrade = grades.complexity + grades.usability + grades.innovation + grades.presentation + grades.proficiency;

        // Create a new grade document
        const newGrade = {
          project_id: projectId,
          judge_id: judge_id,
          complexity: grades.complexity,
          usability: grades.usability,
          innovation: grades.innovation,
          presentation: grades.presentation,
          proficiency: grades.proficiency,
          additionalComment: grades.additionalComment || '',
          grade: totalGrade,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await collections.grades.insertOne(newGrade);
        res.status(201).json({ message: 'Grade submitted successfully.' });
      } catch (error) {
        console.error('Error submitting grade:', error);
        res.status(500).json({ error: 'An error occurred while submitting the grade.' });
      }
    });
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });





module.exports = router;
