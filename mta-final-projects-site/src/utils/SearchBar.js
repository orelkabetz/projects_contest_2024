import React from 'react';
import styled from 'styled-components';

// Styled components for the search bar with mobile responsiveness
const FormContainer = styled.form`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 0;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    /* Make the form stack vertically on smaller screens */
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
    }
`;

const SelectField = styled.select`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: rgba(240, 248, 255, 0.9); 
    color: #175a94;
    flex: 1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #e1f0ff;
    }

    /* Adjust size for mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const InputField = styled.input`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: rgba(240, 248, 255, 0.9); 
    color: #175a94;
    flex: 2;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #e1f0ff;
    }

    /* Adjust size for mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const Button = styled.button`
    padding: 12px 20px;
    background-color: #175a94;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    height: 100%;
    &:hover {
        background-color: #0e3f6d;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const ClearButton = styled(Button)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const SearchBar = ({ searchTerm, searchField, onSearchInputChange, onSearchFieldChange, onSearchButtonClick, onClearFilters, filtersActive }) => {
    return (
        <FormContainer onSubmit={onSearchButtonClick}>
            <InputContainer>
                <SelectField value={searchField} onChange={onSearchFieldChange}>
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
                </SelectField>
                <InputField
                    type="text"
                    value={searchTerm}
                    onChange={onSearchInputChange}
                    placeholder="Search..."
                />
                <Button type="submit">
                    Search
                </Button>
                {filtersActive && (
                    <ClearButton type="button" onClick={onClearFilters}>
                        Clear Filters
                    </ClearButton>
                )}
            </InputContainer>
        </FormContainer>
    );
};

export default SearchBar;
