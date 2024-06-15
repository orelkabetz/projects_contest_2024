import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import CustomCarousel from './Carousel'; // Ensure the correct path to Carousel component

const ProjectList = observer(({ endpoint }) => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false); // State to track if filters are active

    useEffect(() => {
        fetchProjects();
    }, [endpoint]);

    const fetchProjects = (query = '') => {
        const url = `${endpoint}${query}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setProjects(data);
                setFiltersActive(query !== ''); // Set filters active when projects are fetched with a query
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    };

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
    );
});

export default ProjectList;
