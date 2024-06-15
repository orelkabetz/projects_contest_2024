import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CustomCarousel from './Carousel'; // Import Carousel component

const ManageProjects = observer(() => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false); // State to track if filters are active

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

    const fetchProjects = (query = '') => {
        const url = `http://localhost:3001/admin/projects/projectsList${query}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched projects:', data);
                setProjects(data);
                setFiltersActive(true); // Set filters active when projects are fetched
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault(); // Prevent default form submission
        if (searchField && searchTerm) {
            const query = `?search=${searchTerm}&searchField=${searchField}`;
            fetchProjects(query);
        } else {
            alert('Please select a field to search.');
        }
    };

    const handleClearFilters = (event) => {
        event.preventDefault(); // Prevent default form submission
        setSearchTerm('');
        setSearchField('');
        fetchProjects(); // Fetch all projects without filters
        setFiltersActive(false); // Clear filters active state
    };

    return (
        <div>
            <h1>Manage Projects</h1>
            <div>
                <h2>Upload Projects Data</h2>
                <input type="file" onChange={handleFileUpload} accept=".csv" />
            </div>
            <div>
                <h2>Projects List</h2>
                <form onSubmit={handleSearchButtonClick}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <select value={searchField} onChange={handleSearchFieldChange} style={{ marginRight: '10px', padding: '8px' }}>
                            <option value="">Select field</option>
                            <option value="name">Name</option>
                            <option value="Title">Title</option>
                            <option value="WorkshopName">Workshop Name</option>
                            <option value="ProjectOwners">Project Owners</option>
                            <option value="Lecturer">Lecturer</option>
                            <option value="StudentName">Student Name</option>
                            <option value="StudentEmail">Student Email</option>
                            <option value="StudentPhone">Student Phone</option>
                            <option value="WorkshopId">Workshop Id</option>
                        </select>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            placeholder="Search projects"
                            style={{ marginRight: '10px', padding: '8px' }}
                        />
                        <button
                            type="submit" // Ensure button type is submit for the search functionality
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                outline: 'none',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                            onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#003d6b'}
                            onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                        >
                            Search
                        </button>
                        {filtersActive && (
                            <button
                                type="button" // Use type="button" to prevent form submission
                                onClick={handleClearFilters}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                    outline: 'none',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#ac2925'}
                                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </form>
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
