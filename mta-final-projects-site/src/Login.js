import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Login.css';


const Login = () => {
  const [userID, setUsernameID] = useState('');
  const [password, setPassword] = useState('');

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
    fetch('http://localhost:3001/login', {
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
        // Store the token securely (e.g., in local storage)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      window.location.href = '/judge-homepage'; // Redirect to JudgeHome page
      // Redirect or update UI based on the response
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors
    });
  };

  return (
    <div className="login-container">
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
};

export default Login;
