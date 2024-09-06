import { observer } from 'mobx-react-lite';
import React from 'react';
import ProjectList from '../../ProjectsList'; // Ensure the correct path to ProjectList component
import BackButton from '../../utils/BackButton';
import ExportData from './export-data';
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';

const ManageProjects = observer(() => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch(`${backendURL}/upload/projects`, {
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
                <ProjectList endpoint="${backendURL}/admin/projects/projectsList" /> // This is a bug!
                <ExportData></ExportData>
            </div>
            <AdminButtons />
        </div>
    );
});

export default ManageProjects;
