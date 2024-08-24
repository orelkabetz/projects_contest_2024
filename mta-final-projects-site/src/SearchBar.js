import React from 'react';

const SearchBar = ({ searchTerm, searchField, onSearchInputChange, onSearchFieldChange, onSearchButtonClick, onClearFilters, filtersActive }) => {
    return (
        <form onSubmit={onSearchButtonClick} style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <select
                    value={searchField}
                    onChange={onSearchFieldChange}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                        backgroundColor: '#f8f8f8',
                        color: '#333',
                        flex: '1',
                    }}
                >
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
                    onChange={onSearchInputChange}
                    placeholder="Search projects"
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                        backgroundColor: '#f8f8f8',
                        color: '#333',
                        flex: '2',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        fontSize: '16px',
                        height: '100%', // Make button match the height of input fields
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                    Search
                </button>
                {filtersActive && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            fontSize: '16px',
                            height: '100%', // Make button match the height of input fields
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBar;
