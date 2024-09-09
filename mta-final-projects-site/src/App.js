import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import JudgeHome from './users/judge/JudgeHome';
import ProfileSetup from './users/judge/ProfileSetup';
import ViewProjects from './users/judge/ViewProjects';
import GradeProjects from './users/judge/GradeProjects';
import { AdminHome } from './users/admin/admin-homepage';
import ManageJudges from './users/admin/manage-judges';
import ManageProjects from './users/admin/manage-projects';
import AssignProjects from './users/admin/assign-projects';
import ManageGrades from './users/admin/manage-projects-grades';
import ExportData from './users/admin/export-data';
import Podium from './users/admin/podium';
import './App.css';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
import { FaComments } from 'react-icons/fa';  // Import the chat icon




const AdminLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (userStorage.user?.type !== 'admin' && !appStorage.isLoading) {
    return navigate('/');
  }
  return <Outlet />;
});

const JudgeLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (userStorage.user?.type !== 'judge' && !appStorage.isLoading) {
    return navigate('/');
  }
  return <Outlet />;
});

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

  const h1Style = {
    fontSize: '50px',
    color: '#165ea1',
    marginBottom: '15px',
  }; 

  const { userStorage, appStorage } = storages;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

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

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log(`Message to admin: ${chatMessage}`);
      setChatMessage('');
      setIsChatOpen(false);
      alert('Your message has been sent to the admin.');
    }
  };

  const handleInput = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <Router>
      <div className="app-container">
        <h1 style={h1Style}>Projects Contest</h1>
        <Routes>
          <Route path="/" element={<AuthLayout/>}>
            <Route index element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path={"/judge"} element={<JudgeLayout/>}>
            <Route index element={<JudgeHome />} />
            <Route path="profile-setup" element={<ProfileSetup />} />
            <Route path="view-projects" element={<ViewProjects />} />
            <Route path="grade-projects" element={<GradeProjects />} />
          </Route>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<AdminHome/>} />
            <Route path="manage-judges" element={<ManageJudges />} />
            <Route path="manage-projects" element={<ManageProjects />} />
            <Route path="assign-projects" element={<AssignProjects />} />
            <Route path="manage-projects-grades" element={<ManageGrades />} />
            <Route path="export-data" element={<ExportData />} />
            <Route path="podium" element={<Podium />} />
          </Route>
        </Routes>
        <div className="chat-button-container">
          <button className="chat-button" onClick={handleChatToggle}>
            <FaComments size={24} />  {/* Use the chat icon here */}
          </button>
          {isChatOpen && (
            <div className="chat-window">
              <textarea
                className="chat-input"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onInput={handleInput}
                placeholder="Ask the admin a question..."
              />
              <button className="send-button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
});

export default App;
