import React from 'react';

const AdminHome = () => {
    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // API call to the backend
            fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData, // Send the form data with the file
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('File uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error uploading file!');
            });
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <input type="file" onChange={handleFileUpload} accept=".csv" />
        </div>
    );
};

export default AdminHome;