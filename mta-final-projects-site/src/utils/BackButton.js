import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const BackButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #175a94;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top:20px;

  &:hover {
    background-color: #0e3f6d;
  }
`;

const BackArrow = styled.svg`
  width: 24px;
  height: 24px;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const BackButton = ({ route }) => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to go back?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false, // Keep this as false
      customClass: {
        confirmButton: 'swal-button-confirm',
        cancelButton: 'swal-button-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(route);
      }
    });
  };

  return (
    <BackButtonContainer onClick={handleBackButtonClick}>
      <BackArrow xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </BackArrow>
    </BackButtonContainer>
  );
};

export default BackButton;
