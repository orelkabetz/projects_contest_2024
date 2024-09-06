import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Styled components to match the sidebar style
const StyledFormControl = styled(FormControl)`
  margin-bottom: 16px;
  .MuiInputLabel-root {
    color: #175a94;
    font-weight: bold;
  }
  .MuiInputBase-root {
    background-color: rgba(240, 248, 255, 0.9); 
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Make the form field full width on mobile devices */
  @media (max-width: 768px) {
    .MuiInputBase-root {
      width: 100%;
    }
  }
`;

const StyledButton = styled(Button)`
  background-color: #175a94 !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 9px 18px !important;
  font-weight: bold !important;
  margin-top: 16px !important;
  &:hover {
    background-color: #0e3f6d !important;
  }

  /* Full width on mobile devices */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BackButton = styled(Button)`
  background-color: transparent;
  color: #175a94;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 9px 18px;
  &:hover {
    color: #0e3f6d;
    background-color: transparent;
  }

  /* Full width on mobile devices */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProjectGradingForm = ({ formData, handleSelectChange, handleCommentChange, handleSubmit, handleCancelClick }) => {
  // Function to calculate the total
  const calculateTotal = (updatedFormData) => {
    return (
      updatedFormData.complexity +
      updatedFormData.usability +
      updatedFormData.innovation +
      updatedFormData.presentation +
      updatedFormData.proficiency
    );
  };

  // Function to handle the change in select inputs
  const handleSelectChangeAndTotalUpdate = (event) => {
    const { name, value } = event.target;

    // Create a new formData object with the updated value
    const updatedFormData = {
      ...formData,
      [name]: parseInt(value, 10),
    };

    // Calculate the new total
    const newTotal = calculateTotal(updatedFormData);

    // Call the original handleSelectChange function
    handleSelectChange({
      target: {
        name,
        value: parseInt(value, 10),
      },
    });

    // Update the total in the form data
    handleSelectChange({
      target: {
        name: 'total',
        value: newTotal,
      },
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {['complexity', 'usability', 'innovation', 'presentation', 'proficiency'].map((field) => (
        <StyledFormControl fullWidth key={field} margin="normal">
          <InputLabel id={`${field}-label`}>
            {field.charAt(0).toUpperCase() + field.slice(1)} (1-10)
          </InputLabel>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Select
              labelId={`${field}-label`}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleSelectChangeAndTotalUpdate}
              sx={{ width: '50%' }} // Set the width to 50%
            >
              {[...Array(10).keys()].map((n) => (
                <MenuItem key={n + 1} value={n + 1}>{n + 1}</MenuItem>
              ))}
            </Select>
          </div>
        </StyledFormControl>
      ))}
      
      <div className="form-group">
        <label htmlFor="additionalComment">Additional Comments</label>
        <textarea 
          className="form-control" 
          id="additionalComment" 
          rows="3" 
          style={{ 
            width: '100%', 
            borderRadius: '6px', 
            padding: '6px', 
            backgroundColor: 'rgba(240, 248, 255, 0.9)', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
          }}  
          placeholder="Enter any additional comments here"
          value={formData.additionalComment}
          onChange={handleCommentChange}
        />
      </div> 
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        <p><strong>Total:</strong> {formData.total}</p>
      </div>
    </form>
  );
};

export default ProjectGradingForm;
