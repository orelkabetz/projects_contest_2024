import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CustomCarousel from './Carousel'; // Import Carousel component
import BackButton from '../../BackButton';

const ManageProjects = observer(() => {
    const [projects, setProjects] = useState([]);

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
                setProjects(data);
                alert('Projects data uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error uploading projects data!');
            });
        }
    };

    const fetchProjects = () => {
        fetch('http://localhost:3001/admin/projects/projectsList')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched projects:', data);
            setProjects(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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
                    <div className="carousel-container">
                        <div className="card">
                            <CustomCarousel projects={projects} />
                        </div>
                    </div>
                ) : (
                    <p>No projects data available.</p>
                )}
            </div>
        </div>
    );
});

export default ManageProjects;
