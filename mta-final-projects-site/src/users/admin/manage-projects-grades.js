import { backendURL } from '../../config';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2'; 
import GradesManager from './GradesTable'; // Updated from GradesTable
import BackButton from '../../utils/BackButton';
import AdminButtons from './AdminButtons';
import GradesSearchBar from './GradesSearchBar'; // Import the custom search bar
import './ManageGrades.css';

const ManageGrades = () => {
    const [grades, setGrades] = useState([]);
    const [filteredGrades, setFilteredGrades] = useState([]); // To store filtered grades
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);
    const [judgeMap, setJudgeMap] = useState({});
    const [projectMap, setProjectMap] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchGrades();
    }, [token]);

    useEffect(() => {
        // Load judge and project maps from local storage
        const storedJudgeMap = JSON.parse(localStorage.getItem('judgeMap')) || {};
        const storedProjectMap = JSON.parse(localStorage.getItem('projectMap')) || {};
        setJudgeMap(storedJudgeMap);
        setProjectMap(storedProjectMap);
    }, []);

    const fetchGrades = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendURL}/admin/grades`, {
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
            setFilteredGrades(data.grades); // Set initial filtered grades to all grades
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch grades. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for search term
    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search button click
    const handleSearch = () => {
        if (searchField && searchTerm) {
            const filtered = grades.filter((grade) => {
                let fieldValue;

                // Special handling for judge_name and project_name fields
                if (searchField === 'judge_name') {
                    fieldValue = judgeMap[grade.judge_id]?.toLowerCase();
                } else if (searchField === 'project_name') {
                    fieldValue = projectMap[grade.project_id]?.toLowerCase();
                } else {
                    fieldValue = grade[searchField]?.toString().toLowerCase();
                }

                return fieldValue && fieldValue.includes(searchTerm.toLowerCase());
            });
            setFilteredGrades(filtered);
            setFiltersActive(true);
        } else {
            Swal.fire('Error', 'Please select a field and enter a search term.', 'error');
        }
    };

    // Handle clearing filters
    const handleClearFilters = () => {
        setSearchTerm('');
        setSearchField('');
        setFilteredGrades(grades); // Reset to full list of grades
        setFiltersActive(false);
    };

    if (loading) {
        return <h4>Loading grades...</h4>;
    }

    return (
        <div className="manage-grades-container" style={{ backgroundColor: '#f0f8ff' }}>
            <div className="admin-header">
            <h2>Manage Grades</h2>
            </div>
            <GradesSearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={handleSearchInputChange}
                onSearchFieldChange={(e) => setSearchField(e.target.value)}
                onSearch={handleSearch}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
            />
            <div className="grades-manager-table">
                <GradesManager grades={filteredGrades} /> {/* Display filtered grades */}
            </div>
            <BackButton route="/admin" />
            <AdminButtons />
        </div>
    );
};

export default ManageGrades;
