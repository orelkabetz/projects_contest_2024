// AdminButtons.js
import React from 'react';
import './AdminButtons.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { saveAs } from 'file-saver'; // For saving the CSV file
import Papa from 'papaparse'; // For CSV parsing
import axios from 'axios';
import ExportData from './export-data';

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


 const handleExportToCsvClick = async () => {
    try {
      console.log("hi");
        // Fetch all projects
        const projects =  await fetchProjects();

        // Prepare CSV data using PapaParse
        const csvData = Papa.unparse(projects, {
            quotes: true, // Enable quotes around fields
            delimiter: ',', // CSV delimiter
            header: true // Include header row based on field names
        });

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

        // Save the CSV file using FileSaver.js
        saveAs(blob, 'projects.csv');
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        // Handle error (e.g., show error message to user)
    }
};

const fetchProjects = async () => {
  try {
      const response = await axios.get('/projects/projectsList');
      return response.data; // Return the fetched projects
  } catch (error) {
      console.error('Error fetching projects:', error);
      throw error; // Handle or propagate the error
  }
};

  return (
    <div className="admin-buttons">
      <button className="admin-button" onClick={handleManageJudgesClick}>Manage Judges</button>
      <button className="admin-button" onClick={handleManageProjectsClick}>Manage Projects</button>
      <button className="admin-button" onClick={handleAssignProjectsClick}>Assign Projects</button>
      <ExportData url='http://localhost:3001/admin/projects/projectsList' />
    </div>
  );
});

export default AdminButtons;
