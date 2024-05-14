// JudgeButtons.js
import React from 'react';
import './JudgeButtons.css'; // Import CSS file for styling

const JudgeButtons = () => {
  const handleProfileSetupClick = () => {
    window.location.href = '/profile-setup';
  };

  const handleViewProjectsClick = () => {
    window.location.href = '/view-projects';
  };

  const handleGradeProjectsClick = () => {
    window.location.href = '/grade-projects';
  };

  return (
    <div className="judge-buttons">
      <button className="judge-button" onClick={handleProfileSetupClick}>Profile Setup</button>
      <button className="judge-button" onClick={handleViewProjectsClick}>View Projects</button>
      <button className="judge-button" onClick={handleGradeProjectsClick}>Grade Projects</button>
    </div>
  );
};

export default JudgeButtons;
