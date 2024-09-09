const ProjectsJudgesGroup = require('../../DB/entities/projects_judges_group.entity');
const projectsDB = require('../../DB/entities/project.entity');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Function to upload the projects CSV file
async function uploadProjectsCSV(filePath) {
  try {
    // Create a form and append the CSV file
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    // Make the POST request to the /projects endpoint
    const response = await axios.post('${backendURL}/uploads/projects', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error uploading file:', error.message);
    }
  }
}

async function insertProjectsJudgesGroup() {
  try {
    const workshopProjects = await projectsDB.find().select('WorkshopId');
    const projectIds = workshopProjects.map(project => parseInt(project.WorkshopId, 10));
    console.log(projectIds);

    const newGroup = new ProjectsJudgesGroup({
      project_ids: ['15003412','15005518','15004113','15006503','15006801','15001213','15006408'],
      judge_ids: ['315668955'], // Ensure this is the correct format (e.g., ObjectId or integer as needed)
    });

    await newGroup.save();
    console.log('New ProjectsJudgesGroup document inserted:', newGroup);

    await insertGradeTest(projectIds[0]); // Call the new function with the first project ID

  } catch (error) {
    console.error('Error inserting document:', error);
  }
}

async function insertGradeTest(projectId) {
  try {
    // Insert a test grade
    const testGrade = new Grade({
      project_id: projectId, // Use the provided project ID
      judge_id: 315668955,
      complexity: 8,
      usabilty: 7,
      innovation: 9,
      presentation: 8,
      proficency: 7,
      additionalComment: 'Good project overall with minor usability issues.',
      grade: 39
    });

    await testGrade.save();
    console.log('Test Grade document inserted:', testGrade);
  } catch (error) {
    console.error('Error inserting test grade:', error);
  }
}

const projectIds = [
  "15006804",
  "15005912",
  "15005908",
  "15006805",
  "15006504",
  "15006802",
  "15006603",
  "15005909",
  "15006103",
  "15006502",
  "15001215",
  "15005914",
  "15002921",
  "15001217",
  "15005723",
  "15005911",
  "15006409",
  "15006006",
  "15006412",
  "15006412",
  "15005722",
  "15006704",
  "15006104"
];


const judgeIds = [
  '111111111', '123123123', '123454321', '123456789', '209512331', 
  '276143144', '315668955', '524810118', '591302155', '702626296', 
  '130996085'
];

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to insert random grades for each project and judge
async function insertRandomGrades() {
  try {
    // Track the number of grades inserted
    let gradeCount = 0;

    // To ensure unique pairs of project_id and judge_id, use a Set
    const insertedPairs = new Set();

    while (gradeCount < 50) {
      const randomProjectIndex = getRandomInt(0, projectIds.length - 1);
      const randomJudgeIndex = getRandomInt(0, judgeIds.length - 1);

      const projectId = projectIds[randomProjectIndex];
      const judgeId = judgeIds[randomJudgeIndex];

      // Ensure unique combinations of project_id and judge_id
      const pairKey = `${projectId}-${judgeId}`;
      if (!insertedPairs.has(pairKey)) {
        const complexity = getRandomInt(1, 10);
        const usability = getRandomInt(1, 10);
        const innovation = getRandomInt(1, 10);
        const presentation = getRandomInt(1, 10);
        const proficiency = getRandomInt(1, 10);
        const totalGrade = complexity + usability + innovation + presentation + proficiency;

        const gradeData = new Grade({
          project_id: projectId,
          judge_id: judgeId,
          complexity,
          usability,
          innovation,
          presentation,
          proficiency,
          additionalComment: `Randomly generated grade for project ${projectId} by judge ${judgeId}`,
          grade: totalGrade,
        });

        // Save grade data and update the counter
        await gradeData.save();
        insertedPairs.add(pairKey);
        gradeCount++;
        console.log(`Grade #${gradeCount} for project ${projectId} by judge ${judgeId} saved.`);
      }
    }

    console.log('50 random grades inserted successfully.');
  } catch (error) {
    console.error('Error inserting random grades:', error);
  }
}



// Main function to run your scripts
async function main() {
  // const filePath = '/Users/orelkabetz/Documents/CS/4th Year/project/Projects 2024 14.7.csv'; // Replace with your actual CSV file path
  // await uploadProjectsCSV(filePath);

  // Call other functions or scripts you want to run
  await insertRandomGrades(); // Example of another function
}

// Run the main function
main().catch(err => console.error('Script execution failed:', err));