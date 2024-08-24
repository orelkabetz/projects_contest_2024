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
    const response = await axios.post('http://localhost:3001/uploads/projects', form, {
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


// Main function to run your scripts
async function main() {
  // const filePath = '/Users/orelkabetz/Documents/CS/4th Year/project/Projects 2024 14.7.csv'; // Replace with your actual CSV file path
  // await uploadProjectsCSV(filePath);

  // Call other functions or scripts you want to run
  await insertProjectsJudgesGroup(); // Example of another function
}

// Run the main function
main().catch(err => console.error('Script execution failed:', err));