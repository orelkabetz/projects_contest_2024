// AdminButtons.js
import React from 'react';
import './AdminButtons.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { saveAs } from 'file-saver'; // For saving the CSV file
import Papa from 'papaparse'; // For CSV parsing
import axios from 'axios';
import ExportData from './export-data';
import Swal from 'sweetalert2';
import { storages } from '../../stores';

const { userStorage } = storages;

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

  const handleManageProjectsGradesClick = () => {
    navigate("/admin/manage-projects-grades");
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) userStorage.logout();
    });
  };


 

return (
  <div className="admin-buttons">
    <button className="admin-button" onClick={handleManageJudgesClick}>Manage Judges</button>
    <button className="admin-button" onClick={handleManageProjectsClick}>Manage Projects</button>
    <button className="admin-button" onClick={handleAssignProjectsClick}>Assign Projects</button>
    <button className="admin-button" onClick={handleManageProjectsGradesClick}>Manage Projects Grades</button>
    <ExportData url='http://localhost:3001/admin/projects/projectsList' />
    <button className="admin-button logout-button" onClick={handleLogout}>Logout</button>
  </div>
);
});

export default AdminButtons;
