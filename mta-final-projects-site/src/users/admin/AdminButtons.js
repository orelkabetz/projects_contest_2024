import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { saveAs } from 'file-saver'; // For saving the CSV file
import Papa from 'papaparse'; // For CSV parsing
import axios from 'axios';
import ExportData from './export-data';
import { storages } from '../../stores';
import { AiOutlineUser, AiOutlineProject, AiOutlineStar, AiOutlineFileAdd, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai'; // Import icons
import Swal from 'sweetalert2';
import './AdminButtons.css'; // Import CSS file for styling

const AdminButtons = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { userStorage } = storages;

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

  const handlePodiumClick = () => {
    navigate("/admin/podium");
  };

  const handleExportToCsvClick = async () => {
    try {
      console.log("hi");
      // Fetch all projects
      const projects = await fetchProjects();

      // Prepare CSV data using PapaParse
      const csvData = Papa.unparse(projects, {
        quotes: true, // Enable quotes around fields
        delimiter: ',', // CSV delimiter
        header: true, // Include header row based on field names
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

  // Handle clicks outside the sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false); // Close sidebar if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup listener on unmount
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        style={{ cursor: 'pointer', position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </div>
      <div
        ref={sidebarRef} // Add ref to the sidebar for outside click detection
        className={`side-menu ${isOpen ? 'open' : ''}`} // Toggle open/close class
        style={{
          position: 'fixed',
          top: '0',
          left: isOpen ? '0' : '-300px',
          width: '250px',
          height: '100%',
          backgroundColor: 'rgba(240, 248, 255, 0.9)', // Light blue with 90% opacity
          padding: '20px',
          boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
          zIndex: 999,
          transition: 'left 0.3s ease',
        }}
      >
        <div className="admin-buttons">
          <div className="admin-button" onClick={handleManageJudgesClick}>
            Manage Judges
            <AiOutlineUser size={20} style={{ marginLeft: '10px' }} />
          </div>
          <div className="admin-button" onClick={handleManageProjectsClick}>
            Manage Projects
            <AiOutlineProject size={20} style={{ marginLeft: '10px' }} />
          </div>
          <div className="admin-button" onClick={handleAssignProjectsClick}>
            Assign Projects
            <AiOutlineFileAdd size={20} style={{ marginLeft: '10px' }} />
          </div>
          <div className="admin-button" onClick={handleManageProjectsGradesClick}>
            Manage Projects Grades
            <AiOutlineStar size={20} style={{ marginLeft: '10px' }} />
          </div>
          <div className="admin-button" onClick={handlePodiumClick}>
            Podium
            <AiOutlineStar size={20} style={{ marginLeft: '10px' }} />
          </div>
          <div className="admin-button logout-button" onClick={handleLogout} style={{ marginTop: 'auto' }}>
            Logout
            <AiOutlineLogout size={20} style={{ marginLeft: '10px' }} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminButtons;
