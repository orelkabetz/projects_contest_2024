import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Swal from 'sweetalert2'; 
import { storages } from '../../stores';
import Post from '../../utils/Post'; 
import BackButton from '../../utils/BackButton';
import ExportData from './export-data';
import SearchBar from '../../utils/SearchBar';
import GradesTable from './GradesTable'
import AdminButtons from './AdminButtons';



const ManageGrades = () => {
  const [grades, setGrades] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtersActive, setFiltersActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGrades();
}, [token]);


  const handleSearchInputChange = async () => {
    
};

const fetchGrades = async () => {
  //try {
    //setLoading(true);
    //const response = await fetch('http://localhost:3001/grades', {
      //headers: {
        //'Content-Type': 'application/json',
        //Authorization: `Bearer ${localStorage.getItem('token')}`,
      //},
    };




  return (
    <div>
        <h2>Manage Grades</h2>
        <div>
            <SearchBar>
            searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={(e) => setSearchTerm(e.target.value)}
                onSearchFieldChange={(e) => setSearchField(e.target.value)}
                onSearchButtonClick={handleSearchInputChange}
                onClearFilters={handleSearchInputChange}
                filtersActive={filtersActive}
            </SearchBar>
            <GradesTable grades={grades}></GradesTable>
            <BackButton route="/admin" />
        </div>
        <AdminButtons />
    </div>
);
};

export default ManageGrades;
