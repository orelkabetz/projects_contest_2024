import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

const ProjectGradingForm = ({ formData, handleSelectChange, handleCommentChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      {['complexity', 'usability', 'innovation', 'presentation', 'proficiency'].map((field) => (
        <FormControl fullWidth key={field} margin="normal" className="form-control">
          <InputLabel id={`${field}-label`} className="form-label">
            {field.charAt(0).toUpperCase() + field.slice(1)} (1-10)
          </InputLabel>
          <Select
            labelId={`${field}-label`}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleSelectChange}
            className="form-select"
          >
            {[...Array(10).keys()].map((n) => (
              <MenuItem key={n + 1} value={n + 1}>{n + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <div className="form-group">
        <label htmlFor="additionalComment">Additional Comments</label>
        <textarea 
          className="form-control" 
          id="additionalComment" 
          rows="3" 
          style={{ width: '100%' }}  
          placeholder="Enter any additional comments here"
          value={formData.additionalComment}
          onChange={handleCommentChange}
        />
      </div> 
      <p><strong>Total:</strong> {formData.total}</p>

      <Button variant="contained" color="primary" type="submit" fullWidth>
        Finish Grading
      </Button>
    </form>
  );
};

export default ProjectGradingForm;