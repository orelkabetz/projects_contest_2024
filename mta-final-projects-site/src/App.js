import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
// import AdminHome from './admin-homepage'; // Add this import
import JudgeHome from './users/judge/JudgeHome'; // Add this import
import ProfileSetup from './users/judge/ProfileSetup';
import ViewProjects from './users/judge/ViewProjects';
import GradeProjects from './users/judge/GradeProjects';
import {AdminHome} from './users/admin/admin-homepage';
import ManageJudges from './users/admin/manage-judges';
import ManageProjects from './users/admin/manage-projects';
import AssignProjects from './users/admin/assign-projects';
import ExportData from './users/admin/export-data';
import './App.css';
import { observer } from 'mobx-react-lite';
import appStore from './stores/AppStore';
import { useStore, StoreProvider } from './stores';


const AdminLayout = observer(() => {
  const navigate = useNavigate()
  const {userStore, appStore} = useStore();
  if (userStore.user?.type !== "admin" && !appStore.isLoading) {
    return navigate("/")
  }
  return (
    <div>
      <Outlet />
    </div>
  );
});

const JudgeLayout = observer(() => {
  const navigate = useNavigate()
  const {userStore, appStore} = useStore()
  if (userStore.user?.type !== "judge" && !appStore.isLoading) {
    return navigate("/")
  }
  return (
      <Outlet />
  );
});

const AuthLayout = observer(() => {
  const navigate = useNavigate()
  const {userStore, appStore} = useStore()
  if (!appStore.isLoading && userStore.user) {
    if (userStore.user?.type === "admin") {
      return navigate("/admin")
    } else if ( userStore.user?.type === "judge") {
      return navigate("/judge")
    }
  }
  return (
      <Outlet />
  );
});



const App = observer(() => {
  const {userStore} = useStore()
  const initiate = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    appStore.isLoading = true;
    await userStore.getDataFromToken(token);
    appStore.isLoading = false
  }, [])
  useEffect(() => {
    initiate();
  }, []);
  return (
    <StoreProvider>
      <Router>
      <div className="app-container">
        <h1>MTA Final Projects</h1>
        <div style={{background: "red"}} onClick={() => userStore.logout()}>Test logout</div>
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
    </StoreProvider>
  );
});

export default App;