import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
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