import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import axios from 'axios'; 
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';
import BackButton from '../../utils/BackButton';


// Styled components for layout and button
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  gap: 20px;
  width: 100%; /* Increase width */
  max-width: 1600px; /* Double the max width */
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #175a94;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  &:hover {
    background-color: #0e3f6d;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 40%;
  max-width: 70%;
`;




// Main component
const AssignProjectsToJudges = () => {
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [judgesListOpen, setJudgesListOpen] = useState(true); // For toggling the list visibility
  const [projectsListOpen, setProjectsListOpen] = useState(true); // For toggling the list visibility

  useEffect(() => {
    const storedJudgeMap = JSON.parse(localStorage.getItem('judgeMap') || '{}');
    const storedProjectMap = JSON.parse(localStorage.getItem('projectMap') || '{}');

    const judgeOptions = Object.keys(storedJudgeMap).map((id) => ({ value: id, label: storedJudgeMap[id] }));
    const projectOptions = Object.keys(storedProjectMap).map((id) => ({ value: id, label: storedProjectMap[id] }));

    setJudges(judgeOptions);
    setProjects(projectOptions);
  }, []);

  // Handle the assignment on button click
  const handleAssignClick = () => {
    if (selectedJudges.length === 0 || selectedProjects.length === 0) {
      Swal.fire('Error', 'Please select both judges and projects before assigning.', 'error');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to assign selected projects to the selected judges.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, assign them!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Retrieve token from localStorage
          const token = localStorage.getItem('token');
  
          // Retrieve judgeMap and projectMap from localStorage
          const judgeMap = JSON.parse(localStorage.getItem('judgeMap') || '{}');
          const projectMap = JSON.parse(localStorage.getItem('projectMap') || '{}');
  
          // Map judge names and project names to their corresponding IDs
          const projectIds = selectedProjects.map(project => project.value);
          const judgeIds = selectedJudges.map(judge => judge.value);
  
          // Prepare the data for the backend
          const assignmentData = {
            judgeIds, // Array of judge IDs
            projectIds // Array of project IDs
          };
  
          // Send to the backend
          const response = await axios.post(`${backendURL}/admin/assignProjects`, assignmentData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          // Check if the request was successful
          if (response.status === 200) {
            Swal.fire('Assigned!', 'Projects have been successfully assigned to judges.', 'success');
          }
        } catch (error) {
          // Handle any errors
          Swal.fire('Error', error.response?.data?.error || 'An error occurred while assigning projects.', 'error');
        }
      }
    });
  };
  

  return (
    <div className="admin-page-container">
    <Container>
      <div className="admin-header">
      <h2>Assign Projects to Judges</h2>
      </div>

      {/* Multi-select dropdown for judges */}
      <SelectContainer>
        <Select
          isMulti
          options={judges}
          placeholder="Select Judges"
          onChange={setSelectedJudges}
          value={selectedJudges}
          closeMenuOnSelect={false} // Keep dropdown open for continuous selection
          isOpen={judgesListOpen} // Control open/close state
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'rgba(240, 248, 255, 0.9)',
              borderRadius: '8px',
              border: '1px solid #175a94',
            }),
          }}
        />
      </SelectContainer>

      {/* Multi-select dropdown for projects */}
      <SelectContainer>
        <Select
          isMulti
          options={projects}
          placeholder="Select Projects"
          onChange={setSelectedProjects}
          value={selectedProjects}
          closeMenuOnSelect={false} // Keep dropdown open for continuous selection
          isOpen={projectsListOpen} // Control open/close state
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'rgba(240, 248, 255, 0.9)',
              borderRadius: '8px',
              border: '1px solid #175a94',
            }),
          }}
        />
      </SelectContainer>

      {/* Button to trigger assignment */}
      <Button onClick={handleAssignClick}>Assign Projects</Button>
      <AdminButtons />
      <div>
        <BackButton route="/admin" />
      </div>
    </Container>
    </div>
    
    
  );
};

export default AssignProjectsToJudges;
