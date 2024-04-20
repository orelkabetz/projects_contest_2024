import React, { useState } from 'react';
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
    return true
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if(checkValidInputs(userID,password))
    {
      sendLoginRequest(userID, password);
    }
    else
      return
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if(checkValidInputs(userID,password))
    {
      if (!/^[a-zA-Z0-9]+$/.test(password)) {
        alert("Password can contain letters and numbers only");
        return;
      }
      sendRegisterRequest(userID, password);
    }
    else
      return
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
        // Handle response from the server
        console.log('Login response:', data);
        // Redirect or update UI based on the response
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors
      });
  };

  const sendRegisterRequest = (userID, password) => {
    // Send register request to the server
    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID, password }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle response from the server
        console.log('Register response:', data);
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
          <button onClick={handleLogin} type="submit">Log in</button>
          <button onClick={handleRegister} className="register-button">Sign up</button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
