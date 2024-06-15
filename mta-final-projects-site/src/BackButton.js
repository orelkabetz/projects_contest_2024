import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const MySwal = withReactContent(Swal);

const BackButton = ({ route }) => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    MySwal.fire({
      title: 'Confirm',
      text: `Are you sure you want to go back?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false, // Change this to false
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
    <button className="back-button" onClick={handleBackButtonClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="back-arrow">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
    </button>
  );
};

export default BackButton;