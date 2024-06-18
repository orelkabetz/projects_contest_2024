// JudgeButtons.js
import React from 'react';
import './JudgeButtons.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ExportData from '../admin/export-data';

const JudgeButtons = observer(() => {
  const navigate = useNavigate();

  const handleProfileSetupClick = () => {
    navigate("/judge/profile-setup"); // Update the route to "/judge/profile-setup"
  };

  const handleViewProjectsClick = () => {
    navigate("/judge/view-projects"); // Update the route to "/judge/view-projects"
  };

  const handleGradeProjectsClick = () => {
    navigate("/judge/grade-projects"); // Update the route to "/judge/grade-projects"
  };

  return (
    <div className="judge-buttons">
      <button className="judge-button" onClick={handleProfileSetupClick}>Profile Setup</button>
      <button className="judge-button" onClick={handleViewProjectsClick}>View Projects</button>
      <button className="judge-button" onClick={handleGradeProjectsClick}>Grade Projects</button>
    </div>
  );
});

export default JudgeButtons;