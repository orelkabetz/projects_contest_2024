import { observer } from 'mobx-react-lite';
import React from 'react';
import ProjectList from '../../ProjectsList'; // Ensure the correct path to ProjectList component
import BackButton from '../../BackButton';
import ExportData from './export-data';

const ManageProjects = observer(() => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('http://localhost:3001/upload/projects', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Upload success:', data);
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
                <ProjectList endpoint="http://localhost:3001/admin/projects/projectsList" />
                <ExportData></ExportData>
            </div>
        </div>
    );
});

export default ManageProjects;
