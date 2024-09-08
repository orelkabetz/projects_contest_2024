const express = require('express');
const router = express.Router();
const { usersSerivce } = require('./users.service');
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Adjust the path based on your folder structure
const projectsDB = require('../../DB/entities/project.entity')

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

  router.get('/projects/projectsList', async (req, res) => {
    try {
        const { search, searchField } = req.query;
        let query = {};

        if (search && searchField) {
            // Construct the query dynamically based on the selected searchField
            query = {
                [searchField]: { $regex: search, $options: 'i' }
            };
        } else if (search) {
            // Fallback to the existing logic if only search term is provided without a specific field
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { Title: { $regex: search, $options: 'i' } },
                    { WorkshopName: { $regex: search, $options: 'i' } },
                    { ProjectOwners: { $regex: search, $options: 'i' } },
                    { Lecturer: { $regex: search, $options: 'i' } },
                    { StudentName: { $regex: search, $options: 'i' } },
                    { StudentEmail: { $regex: search, $options: 'i' } },
                    { StudentPhone: { $regex: search, $options: 'i' } }
                ]
            };
        }

        router.get('/projects/getById', async (req, res) => {
          try {
            const { projectNumber } = req.query;
            const project = await collections.project_schemas.findOne({ ProjectNumber: projectNumber });
      
              if (!project) {
                console.log('Project not found')
                  return res.status(404).json({ error: 'Project not found' });
              }
      
              res.json(project);
          } catch (error) {
              console.error('Error fetching project:', error);
              res.status(500).json({ error: 'Failed to fetch project: ',error });
          }
      });

        const projects = await collections.project_schemas.find(query).toArray();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
    }
});

router.put('/projects/update', async (req, res) => {
  try {
      const { projectNumber } = req.query; //original project number
      console.log(projectNumber);
      console.log(req.body);
      console.log(req.query);
      const {
          ProjectNumber, // New project number 
          Title,
          ProjectOwners,
          ProjectInfo,
          ProjectImage,
          GithubLink,
          CourseOfStudy,
          StudentName,
          StudentEmail,
          StudentPhone,
      } = req.body; 

      // Update the project with the new data, including the new ProjectNumber
      await collections.project_schemas.updateOne(
          { ProjectNumber: projectNumber },
          {
              $set: {
                  ProjectNumber,
                  Title,
                  ProjectOwners,
                  ProjectInfo,
                  ProjectImage,
                  GithubLink,
                  CourseOfStudy,
                  StudentName,
                  StudentEmail,
                  StudentPhone,
              },
          }
      );

      res.json({ message: 'Project updated successfully' });
  } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
  }
});

router.post('/projects/remove', async (req, res) => {
  const { projectNumber } = req.body;

  if (!projectNumber) {
      return res.status(400).json({ message: 'Project number is required' });
  }

  try {
      const deletedProject = await collections.project_schemas.findOneAndDelete({ ProjectNumber: projectNumber });

      if (deletedProject) {
          res.status(200).json({ message: `Project with number ${projectNumber} deleted successfully.` });
      } else {
          res.status(404).json({ message: `Project with number ${projectNumber} not found.` });
      }
  } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'An error occurred while deleting the project' });
  }
});

router.post('/projects/add', async (req, res) => {
  console.log('Reached add project');
  console.log(req.body);
  const newProject  = req.body;

  if (!newProject.ProjectNumber || !newProject.Title || !newProject.WorkshopName || !newProject.StudentName) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const result = await collections.project_schemas.insertOne(newProject);
    res.status(201).json({ message: 'Project added successfully!', projectId: result.insertedId });
  } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ message: 'An error occurred while adding project' });
  }
});

router.get('/projects/workshops', async (req, res) => {
  try {
    console.log('Reached workshops');
    const workshops = await collections.project_schemas.aggregate([
      {
        $group: {
          _id: { WorkshopId: '$WorkshopId', WorkshopName: '$WorkshopName' }
        }
      },
      { 
        $project: {
          _id: 0,
          WorkshopId: '$_id.WorkshopId',
          WorkshopName: '$_id.WorkshopName'
        }
      }
    ]).toArray();

    console.log(workshops);

    res.status(200).json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ error: 'An error occurred while fetching workshops' });
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
    } catch (error) {s
      console.error('Error removing preferences:', error);
      res.status(500).json({ error: 'An error occurred while removing the preferences' });
    }
  });


  router.get('/grades', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await usersSerivce.checkToken(token); 
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const gradesList = await collections.grades.find({}).toArray();
        res.json({'grades': gradesList});
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'An error occurred while fetching grades' });
    }
  });

  const ProjectsJudgesGroup = require('../../DB/entities/projects_judges_group.entity'); // Path to your model

  router.post('/assignProjects', async (req, res) => {
    try {
      // Extract token and verify the user
      const token = req.headers.authorization.split(' ')[1];
      const user = await usersSerivce.checkToken(token);
      
      if (!user || user.type !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Extract judgeIds and projectIds from request body
      const { judgeIds, projectIds } = req.body;

      if (!judgeIds || !projectIds || judgeIds.length === 0 || projectIds.length === 0) {
        return res.status(400).json({ error: 'Both judges and projects must be selected.' });
      }
  
      // Check if the combination of judgeIds and projectIds already exists
      // const existingGroup = await ProjectsJudgesGroup.findOne({
      //   judge_ids: { $in: judgeIds },
      //   project_ids: { $in: projectIds }
      // });
  
      // if (existingGroup) {
      //   return res.status(400).json({ error: 'Some of the projects have already been assigned to these judges.' });
      // }
  
      // Create a new entry in projects_judges_group
      const newAssignment = new ProjectsJudgesGroup({
        judge_ids: judgeIds,
        project_ids: projectIds
      });
  
      await newAssignment.save(); // Save the new assignment to MongoDB
  
      // Return success response
      res.status(200).json({ message: 'Projects successfully assigned to judges.' });
    } catch (error) {
      console.error('Error assigning projects:', error);
      res.status(500).json({ error: 'An error occurred while assigning projects.' });
    }
  });

  router.get('/judgesProjectsMaps', async (req, res) => {
    try {
        // Fetch all users of type 'judge'
        const judges = await collections.users.find({ 'type': 'judge' }).toArray();

        // Create the judge_id: judge_name dictionary
        const judgeDict = {};
        judges.forEach(judge => {
            judgeDict[judge.ID] = judge.name;
        });

        // Fetch all projects
        const projects = await collections.project_schemas.find({}).toArray();

        // Create the project_id: project_name dictionary
        const projectDict = {};
        projects.forEach(project => {
            projectDict[project.ProjectNumber] = project.Title;
        });

        // Return both dictionaries in the response
        res.json({ judges: judgeDict, projects: projectDict });
    } catch (error) {
        console.error('Error fetching judge and project maps:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });

  router.get('/podium', async (req, res) => {
    try {
      // Aggregating the grades to calculate average scores for each project
      const aggregatedGrades = await Grade.aggregate([
        {
          $group: {
            _id: "$project_id", // Group by project_id
            avgComplexity: { $avg: "$complexity" },
            avgUsability: { $avg: "$usability" },
            avgInnovation: { $avg: "$innovation" },
            avgPresentation: { $avg: "$presentation" },
            avgProficiency: { $avg: "$proficiency" },
            avgTotal: { $avg: "$grade" } // Assuming 'grade' is the overall score
          }
        },
        {
          $sort: { avgTotal: -1 } // Sort by overall average in descending order
        }
      ]);
  
      // Prepare the full data by fetching project details using ProjectNumber
      const podiumData = await Promise.all(aggregatedGrades.map(async (project) => {
        const projectDetails = await projectsDB.findOne({ ProjectNumber: project._id });
        
        if (!projectDetails) {
          console.warn(`Project not found for id: ${project._id}`);
          return null; // Skip projects that are not found
        }
  
        return {
          project_id: project._id,
          title: projectDetails.Title,
          image: projectDetails.ProjectImage,
          avgComplexity: project.avgComplexity,
          avgUsability: project.avgUsability,
          avgInnovation: project.avgInnovation,
          avgPresentation: project.avgPresentation,
          avgProficiency: project.avgProficiency,
          avgTotal: project.avgTotal,
        };
      }));
  
      // Filter out any projects that were not found
      const validPodiumData = podiumData.filter(p => p !== null);
  
      // Sort by individual categories and prepare top 3 lists
      const topOverallProjects = [...validPodiumData].sort((a, b) => b.avgTotal - a.avgTotal).slice(0, 3);
      const topComplexity = [...validPodiumData].sort((a, b) => b.avgComplexity - a.avgComplexity).slice(0, 3);
      const topUsability = [...validPodiumData].sort((a, b) => b.avgUsability - a.avgUsability).slice(0, 3);
      const topInnovation = [...validPodiumData].sort((a, b) => b.avgInnovation - a.avgInnovation).slice(0, 3);
      const topPresentation = [...validPodiumData].sort((a, b) => b.avgPresentation - a.avgPresentation).slice(0, 3);
      const topProficiency = [...validPodiumData].sort((a, b) => b.avgProficiency - a.avgProficiency).slice(0, 3);
  
      // Prepare the response with the aggregated and project details
      res.json({
        topOverallProjects,
        topComplexity,
        topUsability,
        topInnovation,
        topPresentation,
        topProficiency,
        allProjects: validPodiumData // Add all projects with avg scores and details
      });
  
    } catch (error) {
      console.error('Error fetching podium data:', error);
      res.status(500).json({ message: 'Error fetching podium data' });
    }
  });  

  })
  .catch((err) => {
    console.error('Error getting collections:', err);
  });


module.exports = router;
