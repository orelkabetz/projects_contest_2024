import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Swal from 'sweetalert2'; 
import GradesManager from './GradesTable'; // Updated from GradesTable
import BackButton from '../../utils/BackButton';
import AdminButtons from './AdminButtons';
import SearchBar from '../../utils/SearchBar';

const ManageGrades = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchGrades();
    }, [token]);

    const fetchGrades = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/admin/grades', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch grades');
            }

            const data = await response.json();
            setGrades(data.grades);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch grades. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <h2>Manage Grades</h2>
            <SearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={handleSearchInputChange}
                onSearchFieldChange={(e) => setSearchField(e.target.value)}
                onSearchButtonClick={() => console.log('Search triggered')}
                onClearFilters={() => console.log('Filters cleared')}
                filtersActive={filtersActive}
            />
            <GradesManager grades={grades} />
            <BackButton route="/admin" />
            <AdminButtons />
        </div>
    );
};

export default ManageGrades;
