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
  width: 100%;
  max-width: 1600px;
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
  const [preferences, setPreferences] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  // Store the initial list of judges from local storage
  const [allJudges, setAllJudges] = useState([]);

  useEffect(() => {
    // Fetch judges and projects from local storage
    const storedJudgeMap = JSON.parse(localStorage.getItem('judgeMap') || '{}');
    const storedProjectMap = JSON.parse(localStorage.getItem('projectMap') || '{}');

    const judgeOptions = Object.keys(storedJudgeMap).map(id => ({ value: id, label: storedJudgeMap[id] }));
    const projectOptions = Object.keys(storedProjectMap).map(id => ({ value: id, label: storedProjectMap[id] }));

    setJudges(judgeOptions);
    setProjects(projectOptions);
    setAllJudges(judgeOptions); // Store the full list of judges

    // Fetch preferences from the API
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`${backendURL}/preferences`);
        console.log('Fetched preferences:', response.data); // Debugging line

        const preferencesList = response.data.map(pref => ({
          value: pref._id,
          label: pref.ID || 'Unnamed Preference'
        }));

        console.log('Mapped preferences:', preferencesList); // Debugging line
        setPreferences(preferencesList);
      } catch (error) {
        console.error('Error fetching preferences:', error);
        Swal.fire('Error', 'Failed to fetch preferences.', 'error');
      }
    };

    fetchPreferences();
  }, []);

  // Filter judges based on selected preferences
  useEffect(() => {
    if (selectedPreferences.length === 0) {
      setJudges(allJudges); // Show all judges if no preferences are selected
    } else {
      const selectedPrefIds = selectedPreferences.map(pref => pref.value);

      const filteredJudges = allJudges.filter(judge =>
        judge.value && // Ensure judge has a value
        judge.value.selected_preferences.some(pref => selectedPrefIds.includes(pref))
      );

      setJudges(filteredJudges);
    }
  }, [selectedPreferences, allJudges]);

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
          const token = localStorage.getItem('token');
          const judgeIds = selectedJudges.map(judge => judge.value);
          const projectIds = selectedProjects.map(project => project.value);
          const preferenceIds = selectedPreferences.map(pref => pref.value);

          const assignmentData = {
            judgeIds,
            projectIds,
            preferenceIds
          };

          const response = await axios.post(`${backendURL}/admin/assignProjects`, assignmentData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            Swal.fire('Assigned!', 'Projects have been successfully assigned to judges.', 'success');
          }
        } catch (error) {
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

        {/* Multi-select dropdown for preferences */}
        <SelectContainer>
          <Select
            isMulti
            options={preferences}
            placeholder="Select Preferences"
            onChange={setSelectedPreferences}
            value={selectedPreferences}
            closeMenuOnSelect={false}
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

        {/* Multi-select dropdown for judges */}
        <SelectContainer>
          <Select
            isMulti
            options={judges}
            placeholder="Select Judges"
            onChange={setSelectedJudges}
            value={selectedJudges}
            closeMenuOnSelect={false}
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
            closeMenuOnSelect={false}
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
