import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import CustomCarousel from './Carousel'; // Ensure the correct path to Carousel component
import SearchBar from './utils/SearchBar'; // Import the SearchBar component

const ProjectList = observer(({ endpoint }) => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, [endpoint]);

    const fetchProjects = (query = '') => {
        const url = `${endpoint}${query}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setProjects(data);
                setFiltersActive(query !== '');
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
        event.preventDefault();
        if (searchField && searchTerm) {
            const query = `?search=${searchTerm}&searchField=${searchField}`;
            fetchProjects(query);
        } else {
            alert('Please select a field to search.');
        }
    };

    const handleClearFilters = (event) => {
        event.preventDefault();
        setSearchTerm('');
        setSearchField('');
        fetchProjects();
        setFiltersActive(false);
    };

    return (
        <div>
            <SearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={handleSearchInputChange}
                onSearchFieldChange={handleSearchFieldChange}
                onSearchButtonClick={handleSearchButtonClick}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
            />
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
