import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AdminHome from './admin-homepage'; // Add this import
import JudgeHome from './users/judge/JudgeHome'; // Add this import
import ProfileSetup from './users/judge/ProfileSetup';
import ViewProjects from './users/judge/ViewProjects';
import GradeProjects from './users/judge/GradeProjects';
import AdminHome from './users/admin/admin-homepage';
import ManageJudges from './users/admin/manage-judges';
import ManageProjects from './users/admin/manage-projects';
import AssignProjects from './users/admin/assign-projects';
import ExportData from './users/admin/export-data';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <h1>MTA Final Projects</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/judge-homepage" element={<JudgeHome />} /> // Update this route 
          <Route path="/profile-setup" element={<ProfileSetup />} /> // Update this route 
          <Route path="/view-projects" element={<ViewProjects />} /> // Update this route 
          <Route path="/grade-projects" element={<GradeProjects />} /> // Update this route          
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/manage-judges" element={<ManageJudges />} />
          <Route path="/admin/manage-projects" element={<ManageProjects />} />
          <Route path="/admin/assign-projects" element={<AssignProjects />} />
          <Route path="/admin/export-data" element={<ExportData />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;