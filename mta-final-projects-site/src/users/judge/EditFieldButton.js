import React from 'react';
import Swal from 'sweetalert2';

const EditFieldButton = ({ field, user, updateUser }) => {
  const handleEdit = () => {
    Swal.fire({
      title: `Edit ${field}`,
      input: field === 'password' ? 'password' : 'text',
      inputValue: user[field] || '',
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: (newValue) => {
        if (!newValue) {
          Swal.showValidationMessage(`Please enter a new ${field}`);
        }
        return newValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newValue = result.value;
        const url = `http://localhost:3001/user/updateField`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ field, newValue }),
        })
          .then((response) => response.json())
          .then((data) => {
            updateUser(field, newValue); // Update local state
            Swal.fire('Success', `${field} updated successfully!`, 'success');
          })
          .catch((error) => {
            Swal.fire('Error', 'There was an error updating the information.', 'error');
            console.error('Error updating user info:', error);
          });
      }
    });
  };

  return <button onClick={handleEdit}>Edit {field}</button>;
};

export default EditFieldButton;
