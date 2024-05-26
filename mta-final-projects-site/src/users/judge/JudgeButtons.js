// JudgeButtons.js
import React from 'react';
import './JudgeButtons.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
const JudgeButtons = observer(() => {
  const navigate = useNavigate()
  const handleProfileSetupClick = () => {
    navigate("/profile-setup");
  };

  const handleViewProjectsClick = () => {
    navigate("/view-projects");
  };

  const handleGradeProjectsClick = () => {
    navigate("/grade-projects");
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
