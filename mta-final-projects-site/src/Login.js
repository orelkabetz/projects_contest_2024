import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import './Login.css';
import userStorage from './stores/UserStorage';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
import { backendURL } from './config';


const Login = observer(() => {
  const {userStorage} = storages
  const [userID, setUsernameID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const checkValidInputs = (userID, password) => {
    if (!userID.trim() || !password.trim()) {
      alert("Please enter both ID number and password");
      return false; // Prevent further execution
    }
    if (userID.length < 9) {
      alert("ID number must be at least 9 characters long");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (checkValidInputs(userID, password)) {
      sendLoginRequest(userID, password);
    }
  };
  

  const sendLoginRequest = (userID, password) => {
    // Send login request to the server
    fetch(`${backendURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID, password }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Login response:', data);
      if (data.success) {
        // Store the token in local storage or session storage
        localStorage.setItem('token', data.token);
        console.log(data.token);
        userStorage.user = data.user;
        // Redirect based on user type
        if (data.user.type === 'admin') {
          navigate('/admin');
        } else if (data.user.type === 'judge') {
          navigate('/judge');
        }
      } else {
        // Handle login failure
        alert('Invalid credentials');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors
    });
  };


  return (
    <div className="login-container" style={{ marginTop: "5px", textAlign: "center" }}>
      <img src="/Assets/Logos/MTA_Logo_Black.svg" alt="Logo" className="logo_Mta_Black" />
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userID">ID Number:</label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setUsernameID(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Log in</button>
          <button type="submit">

          <Link to="/register" className="register-button">Sign up</Link>  {/* Add a Link to the Register page */}
          </button>
        </form>
      </div>
    </div>
  );
});

export default Login;
