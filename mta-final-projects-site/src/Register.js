import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import './Login.css';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
import { backendURL } from './config.js';

const Register = observer(() => {
  const [userID, setUsernameID] = useState('');
  const [fullName, setFullName] = useState(''); // State for full name
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState('');
  const { userStorage } = storages;
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering:', userID, fullName, email, password);
    sendRegisterRequestWithFullInfo(userID, fullName, email, password);
  };

  const sendRegisterRequestWithFullInfo = (userID, fullName, email, password) => {
    // Send register request to the server
    fetch(`${backendURL}/registerFullInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID, fullName, email, password }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Register response:', data);
      // Handle the response here, such as redirecting the user or showing a success message
      if (data.success) {
        // Assuming the server sends back a 'success' field when registration is successful
        console.log("Registration successful!");
        sendLoginRequest(userID, password);
      }
      else{
        alert("Registration failed! Please try again.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors here
    });
  };

  const sendLoginRequest = (userID, password) => {
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
        localStorage.setItem('token', data.token);
        userStorage.user = data.user;
        // Redirect based on user type
        if (data.user.type === 'admin') {
          navigate('/admin');
        } else if (data.user.type === 'judge') {
          navigate('/judge');
        }
      }
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
        <form onSubmit={handleRegister}>
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
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit">Register</button>
          <br />
          <Link to="/" className="login-link">Already have an account? Log in</Link>
        </form>
      </div>
    </div>
  );
});

export default Register;
