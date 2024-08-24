import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './Post';
import axios from 'axios';
import styled from 'styled-components';
import SearchBar from '../../SearchBar'; // Import SearchBar component

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

const Feed = () => {
    const [projects, setProjects] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);

    useEffect(() => {
        if (!filtersActive) {
            fetchProjects();
        }
    }, [page]);

    const fetchProjects = async (query = '') => {
        try {
            const response = await axios.get(`http://localhost:3001/admin/projects/projectsList?page=${page}${query}`);
            console.log(response.data); // Log the entire response to inspect the structure
            
            if (filtersActive) {
                // If filters are active, show only the filtered results
                setProjects(response.data);
                setHasMore(false); // Stop infinite scrolling
            } else {
                // Append new projects to the list
                setProjects(prevProjects => [...prevProjects, ...response.data]);
                if (response.data.length === 0) {
                    setHasMore(false); // Stop infinite scrolling if no more projects
                }
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
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
            const query = `&search=${searchTerm}&searchField=${searchField}`;
            setPage(1); // Reset the page for a new search
            setProjects([]); // Clear previous projects
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
        setPage(1); // Reset the page
        setProjects([]); // Clear previous projects
        fetchProjects();
        setFiltersActive(false); // Disable filter mode
        setHasMore(true); // Re-enable infinite scrolling
    };

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
            <InfiniteScroll
                dataLength={projects.length}
                next={fetchProjects}
                hasMore={hasMore}
                loader={<Loader>Loading...</Loader>}
                endMessage={<EndMessage>No more projects to show</EndMessage>}
            >
                {projects.map((project, index) => (
                    <Post key={index} project={project} />
                ))}
            </InfiniteScroll>
        </FeedContainer>
    );
};

export default Feed;
