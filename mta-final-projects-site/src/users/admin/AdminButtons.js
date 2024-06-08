// AdminButtons.js
import React from 'react';
import './AdminButtons.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
const AdminButtons = observer(() => {
  const navigate = useNavigate()
  const handleManageJudgesClick = () => {
    navigate("/admin/manage-judges");
  };

  const handleManageProjectsClick = () => {
    navigate("/admin/manage-projects");
  };

  const handleAssignProjectsClick = () => {
    navigate("/admin/assign-projects");
  };

  const handleExportDataClick = () => {
    navigate("/admin/export-data");
  };

  return (
    <div className="admin-buttons">
      <button className="admin-button" onClick={handleManageJudgesClick}>Manage Judges</button>
      <button className="admin-button" onClick={handleManageProjectsClick}>Manage Projects</button>
      <button className="admin-button" onClick={handleAssignProjectsClick}>Assign Projects</button>
      <button className="admin-button" onClick={handleExportDataClick}>Export Data</button>
    </div>
  );
});

export default AdminButtons;
