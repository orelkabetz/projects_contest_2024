import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import LogoutButton from './LogoutButton'; 
import JudgeHome from './users/judge/JudgeHome'; // Add this import
import ProfileSetup from './users/judge/ProfileSetup';
import ViewProjects from './users/judge/ViewProjects';
import GradeProjects from './users/judge/GradeProjects';
import { AdminHome } from './users/admin/admin-homepage';
import ManageJudges from './users/admin/manage-judges';
import ManageProjects from './users/admin/manage-projects';
import AssignProjects from './users/admin/assign-projects';
import ExportData from './users/admin/export-data';
import './App.css';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
/**
 * Make sure that the user has the premissions of admin
 */
const AdminLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (userStorage.user?.type !== 'admin' && !appStorage.isLoading) {
    return navigate('/');
  }
  return (
    <div>
      <Outlet />
    </div>
  );
});

/**
 * Make sure that the user has the premissions of judge
 */
const JudgeLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (userStorage.user?.type !== 'judge' && !appStorage.isLoading) {
    return navigate('/');
  }
  return <Outlet />;
});

/**
 * make the user get into the right page if he is alrady logged in
 */
const AuthLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (!appStorage.isLoading && userStorage.user) {
    if (userStorage.user?.type === 'admin') {
      return navigate('/admin');
    } else if (userStorage.user?.type === 'judge') {
      return navigate('/judge');
    }
  }
  return <Outlet />;
});

const App = observer(() => {
  const { userStorage, appStorage } = storages;
  const initiate = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    appStorage.isLoading = true;
    await userStorage.getDataFromToken(token);
    appStorage.isLoading = false;
  }, []);

  useEffect(() => {
    initiate();
  }, []);

  return (
      <Router>
      <div className="app-container">
        <h1>MTA Final Projects</h1>
        <LogoutButton userStorage={userStorage} />
        <Routes>
          <Route path="/" element={<AuthLayout/>} >
            <Route index element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path={"/judge"} element={<JudgeLayout/>}>
            <Route index element={<JudgeHome />} /> // Update this route 
            <Route path="profile-setup" element={<ProfileSetup />} /> // Update this route 
            <Route path="view-projects" element={<ViewProjects />} /> // Update this route 
            <Route path="grade-projects" element={<GradeProjects />} /> // Update this route          
          </Route>
          <Route path="/admin" element={<AdminLayout/>} >
            <Route index element={<AdminHome/>} />
            <Route path="manage-judges" element={<ManageJudges />} />
            <Route path="manage-projects" element={<ManageProjects />} />
            <Route path="assign-projects" element={<AssignProjects />} />
            <Route path="export-data" element={<ExportData />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
});

export default App;