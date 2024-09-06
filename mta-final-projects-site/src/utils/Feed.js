import React, { useState, useEffect } from 'react';
import Post from './Post';
import axios from 'axios';
import styled from 'styled-components';
import SearchBar from './SearchBar'; // Import SearchBar component
import { backendURL } from '../../src/config';

// Styled components for Feed
const FeedContainer = styled.div`
    background-color: #f0f8ff; /* Matches the app container background */
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`;

const Loader = styled.h4`
    color: #175a94; /* Matches the title color */
    text-align: center;
`;

const EndMessage = styled.p`
    color: #555;
    text-align: center;
`;

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Feed = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async (query = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendURL}/admin/projects/projectsList${query}`);
            let fetchedProjects = response.data;

            // Shuffle the projects array
            const shuffledProjects = shuffleArray(fetchedProjects);

            setProjects(shuffledProjects);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
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
            setFiltersActive(true); // Enable filter mode
        } else {
            alert('Please select a field to search.');
        }
    };

    const handleClearFilters = (event) => {
        event.preventDefault();
        setSearchTerm('');
        setSearchField('');
        fetchProjects(); // Fetch all projects without filters
        setFiltersActive(false); // Disable filter mode
    };

    if (loading) {
        return <Loader>Loading projects...</Loader>;
    }

    return (
        <FeedContainer>
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
                projects.map((project) => (
                    <Post
                        key={project._id}
                        project={project}
                        showGradeButton={false} // Don't show the Grade button
                    />
                ))
            ) : (
                <EndMessage>No projects to show</EndMessage>
            )}
        </FeedContainer>
    );
};

export default Feed;
