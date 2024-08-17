const ProjectsJudgesGroup = require('../../DB/entities/projects_judges_group.entity');
const projectsDB = require('../../DB/entities/project.entity');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path

async function insertProjectsJudgesGroup() {
  try {
    const workshopProjects = await projectsDB.find().select('WorkshopId');
    const projectIds = workshopProjects.map(project => parseInt(project.WorkshopId, 10));
    console.log(projectIds);

    const newGroup = new ProjectsJudgesGroup({
      project_ids: projectIds,
      judge_ids: [315668955], // Ensure this is the correct format (e.g., ObjectId or integer as needed)
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

// Main function for debugging
async function main() {
  await insertGradeTest(150058);
}

main(); // Call main to execute the script