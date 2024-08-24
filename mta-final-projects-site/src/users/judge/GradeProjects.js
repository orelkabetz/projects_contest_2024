// src/components/GradeProjects/GradeProjects.jsx

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { storages } from '../../stores';
import ProjectGradingForm from './ProjectGradingForm';
import BackButton from '../../BackButton';
import './GradeProjects.css';

const MySwal = withReactContent(Swal);

const GradeProjects = observer(() => {
  const { userStorage } = storages;
  const user = userStorage.user;
  const token = localStorage.getItem('token');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    complexity: 10,
    usability: 10,
    innovation: 10,
    presentation: 10,
    proficiency: 10,
    additionalComment: '',
    total: 50,
  });
  const [loading, setLoading] = useState(true);

  // Fetch projects assigned to the judge on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/projectsForJudge/projectList', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        MySwal.fire('Error', 'Failed to fetch projects. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  // Handle changes in grading inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const numericValue = parseInt(value, 10) || 0;

    const updatedFormData = {
      ...formData,
      [name]: numericValue,
    };

    const total =
      updatedFormData.complexity +
      updatedFormData.usability +
      updatedFormData.innovation +
      updatedFormData.presentation +
      updatedFormData.proficiency;

    setFormData({
      ...updatedFormData,
      total,
    });
  };

  // Handle comment input change
  const handleCommentChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      additionalComment: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmation = await MySwal.fire({
      title: 'Confirm Submission',
      text: 'Are you sure you want to submit these grades? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'Cancel',
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch('http://localhost:3001/judge/submitGrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId: selectedProject.id,
            grades: formData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit grades');
        }

        const data = await response.json();

        MySwal.fire('Success', data.message, 'success');

        // Remove the graded project from the list
        setProjects(projects.filter((project) => project.id !== selectedProject.id));
        setSelectedProject(null);
        resetFormData();
      } catch (error) {
        console.error('Error submitting grades:', error);
        MySwal.fire('Error', 'Failed to submit grades. Please try again.', 'error');
      }
    }
  };

  // Reset form data to initial state
  const resetFormData = () => {
    setFormData({
      complexity: 10,
      usability: 10,
      innovation: 10,
      presentation: 10,
      proficiency: 10,
      additionalComment: '',
      total: 50,
    });
  };

  // Render loading state
  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="grading-container">
      <BackButton route="/judge" />
      <h2 className="welcome-message">Welcome, {user?.name}! Let's grade some projects.</h2>

      {!selectedProject ? (
        <div className="projects-list">
          <h3>Select a Project to Grade:</h3>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => setSelectedProject(project)}
              >
                <h4>{project.name}</h4>
                <p>
                  <strong>Floor:</strong> {project.floor}
                </p>
                <p>
                  <strong>Room:</strong> {project.room}
                </p>
              </div>
            ))
          ) : (
            <p>No projects assigned to you at the moment.</p>
          )}
        </div>
      ) : (
        <div className="grading-form">
          <h3>Grading: {selectedProject.name}</h3>
          <ProjectGradingForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleCommentChange={handleCommentChange}
            handleSubmit={handleSubmit}
            handleBack={() => setSelectedProject(null)}
          />
        </div>
      )}
    </div>
  );
});

export default GradeProjects;
