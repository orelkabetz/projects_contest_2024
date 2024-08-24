import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AiOutlineProfile, AiOutlineEye, AiOutlineStar, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';
import { storages } from '../../stores';
import Swal from 'sweetalert2';
import './JudgeButtons.css';

const JudgeButtons = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userStorage } = storages;

  const handleProfileSetupClick = () => {
    navigate("/judge/profile-setup");
  };

  const handleViewProjectsClick = () => {
    navigate("/judge/view-projects");
  };

  const handleGradeProjectsClick = () => {
    navigate("/judge/grade-projects");
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
    <div style={{ position: 'relative' }}>
      <div 
        style={{ cursor: 'pointer', position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </div>
      <div
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
        <div className="judge-buttons">
          <div className="judge-button" onClick={handleProfileSetupClick}>
            <AiOutlineProfile size={20} style={{ marginRight: '10px' }} />
            Profile Setup
          </div>
          <div className="judge-button" onClick={handleGradeProjectsClick}>
            <AiOutlineStar size={20} style={{ marginRight: '10px' }} />
            Grade Projects
          </div>
          <div
            className="judge-button logout-button"
            onClick={handleLogout}
          >
            <AiOutlineLogout size={20} style={{ marginRight: '10px' }} />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
});

export default JudgeButtons;
