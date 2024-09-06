import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components for the search bar
const SearchContainer = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 0;

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        padding: 5px;
    }
`;

const SearchInputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    /* Stack elements vertically on smaller screens */
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
    }
`;

const SearchSelect = styled.select`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: rgba(240, 248, 255, 0.9); 
    color: #175a94;
    flex: 1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    &:hover {
        background-color: #e1f0ff;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const SearchInput = styled.input`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: rgba(240, 248, 255, 0.9); 
    color: #175a94;
    flex: 2;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    &:hover {
        background-color: #e1f0ff;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const SearchButton = styled.button`
    padding: 12px 20px;
    background-color: #175a94;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-size: 16px;

    &:hover {
        background-color: #0e3f6d;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const ClearButton = styled(SearchButton)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

// SearchBar component for grades filtering with Judge Name and Project Name
const GradesSearchBar = ({ searchTerm, searchField, onSearchInputChange, onSearchFieldChange, onSearch, onClearFilters, filtersActive }) => {
    const [judgeMap, setJudgeMap] = useState({});
    const [projectMap, setProjectMap] = useState({});

    useEffect(() => {
        // Load judge and project maps from local storage
        const storedJudgeMap = JSON.parse(localStorage.getItem('judgeMap')) || {};
        const storedProjectMap = JSON.parse(localStorage.getItem('projectMap')) || {};
        setJudgeMap(storedJudgeMap);
        setProjectMap(storedProjectMap);
    }, []);

    return (
        <SearchContainer>
            <SearchInputContainer>
                <SearchSelect value={searchField} onChange={onSearchFieldChange}>
                    <option value="">Select field</option>
                    <option value="judge_id">Judge ID</option>
                    <option value="judge_name">Judge Name</option> 
                    <option value="project_id">Project ID</option>
                    <option value="project_name">Project Name</option>
                    <option value="complexity">Complexity</option>
                    <option value="usability">Usability</option>
                    <option value="innovation">Innovation</option>
                    <option value="presentation">Presentation</option>
                    <option value="proficiency">Proficiency</option>
                    <option value="additionalComment">Additional Comment</option>
                    <option value="grade">Total Grade</option>
                </SearchSelect>
                <SearchInput
                    type="text"
                    value={searchTerm}
                    onChange={onSearchInputChange}
                    placeholder="Search..."
                />
                <SearchButton type="button" onClick={onSearch}>Search</SearchButton>
                {filtersActive && (
                    <ClearButton type="button" onClick={onClearFilters}>Clear</ClearButton>
                )}
            </SearchInputContainer>
        </SearchContainer>
    );
};

export default GradesSearchBar;
