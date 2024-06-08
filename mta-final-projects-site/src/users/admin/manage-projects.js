import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import BackButton from '../../BackButton';


const ManageProjects = observer(() => {
    const [projects, setProjects] = useState([]);

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // API call to the backend to upload projects data
            fetch('http://localhost:3001/upload/projects', {
                method: 'POST',
                body: formData, // Send the form data with the file
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setProjects(data); // Update the projects state with the response data
                alert('Projects data uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error uploading projects data!');
            });
        }
    };

    return (
        <div>
            <h1>Manage Projects</h1>
            <div>
            <BackButton route="/admin" />
                <h2>Upload Projects Data</h2>
                <input type="file" onChange={handleFileUpload} accept=".csv" />
            </div>
            <div>
                <h2>Projects List</h2>
                {projects.length > 0 ? (
                    <ul>
                        {projects.map((project, index) => (
                            <li key={index}>
                                <strong>Title:</strong> {project.Title}<br />
                                <strong>Workshop Name:</strong> {project.WorkshopName}<br />
                                <strong>Workshop ID:</strong> {project.WorkshopId}<br />
                                <strong>Project Number:</strong> {project.ProjectNumber}<br />
                                <strong>Project Info:</strong> {project.ProjectInfo}<br />
                                <strong>Project Owners:</strong> {project.ProjectOwners}<br />
                                <strong>Lecturer:</strong> {project.Lecturer}<br />
                                <strong>Student Name:</strong> {project.StudentName}<br />
                                <strong>Student Email:</strong> {project.StudentEmail}<br />
                                <strong>Student Phone:</strong> {project.StudentPhone}<br />
                                <strong>Project Year:</strong> {project.ProjectYear}<br />
                                {/* Add more fields as needed */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects data available.</p>
                )}
            </div>
        </div>
    );
});

export default ManageProjects;