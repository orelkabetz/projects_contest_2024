import React from 'react';
import JudgeButtons from './JudgeButtons'; // Import JudgeButtons component
import { storages } from '../../stores';
import { observer } from 'mobx-react-lite';

const JudgeHome = observer( () => {
    const {userStorage} = storages
    const user = userStorage.user
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
            <h2>Judge Dashboard</h2>
            <h3>Welcome, {user?.name}!</h3>
            <JudgeButtons /> {/* Add JudgeButtons component */}
        </div>
    );
});

export default JudgeHome;
