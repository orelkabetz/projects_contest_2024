import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import BackButton from '../../BackButton';
import { storages } from '../../stores';
import ProjectGradingForm from './ProjectGradingForm';
import './GradeProjects.css'; 

const GradeProjects = observer(() => {
  const { userStorage } = storages;
  const user = userStorage.user;
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    floor: 0,
    room: 0,
    complexity: 10,
    usability: 10,
    innovation: 10,
    presentation: 10,
    proficiency: 10,
    total: 50,
    additionalComment: '',
  });

//   useEffect(() => {
//     const fetchProjectsForUser = async () => {
//       try {
//         const groupResponse = await fetch(`http://localhost:3001/users/projectsForJudge/projectList`);
//         const projectsData = await groupResponse.json();
//         setProjects(projectsData);  // Assuming projectsData contains the array of projects
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };
  
//     fetchProjectsForUser();
//   }, []);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
      total: calculateTotal({ ...formData, [name]: value }),
    });
  };

  const calculateTotal = (data) => {
    const { complexity, usability, innovation, presentation, proficiency } = data;
    return complexity + usability + innovation + presentation + proficiency;
  };

  const handleCommentChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      additionalComment: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once submitted, you will not be able to change the grades!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        console.log('Submitted Data:', formData);
      }
    });
  };

  return (
    <div className="grading-form">
      <h2>Hello, Grade Project</h2>

      {selectedProject ? (
        <>
          <p><strong>Floor:</strong> {formData.floor}</p>
          <p><strong>Room:</strong> {formData.room}</p>

          <ProjectGradingForm
            formData={formData}
            handleSelectChange={handleSelectChange}
            handleCommentChange={handleCommentChange}
            handleSubmit={handleSubmit}
          />
        </>
      ) : (
        <div>
          {projects.map((project) => (
            <button
              key={project.ID}
              onClick={() => setSelectedProject(project)}
              style={{ display: 'block', marginBottom: '10px' }}
            >
              {project.name}
            </button>
          ))}
        </div>
      )}

      <BackButton route="/judge"/>
    </div>
  );
});

export default GradeProjects;