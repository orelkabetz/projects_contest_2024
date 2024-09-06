import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { storages } from '../../stores';
import ProjectGradingForm from './ProjectGradingForm';
import BackButton from '../../BackButton';
import SearchBar from '../../SearchBar'; // Import SearchBar component
import './GradeProjects.css';
import { backendURL } from '../../config';


const MySwal = withReactContent(Swal);

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

const ProjectCard = styled.div`
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GradeProjectsFeed = observer(() => {
    const { userStorage } = storages;
    const user = userStorage.user;
    const token = localStorage.getItem('token');

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        complexity: 10,
        usability: 10,
        innovation: 10,
        presentation: 10,
        proficiency: 10,
        additionalComment: '',
        total: 50,
    });
    const [loading, setLoading] = useState(true);
    const [filtersActive, setFiltersActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filterOptions, setFilterOptions] = useState([]);

    // Fetch projects function
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendURL}/projectsForJudge/projectList`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            MySwal.fire('Error', 'Failed to fetch projects. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        
        // Define filter options

        setFilterOptions(options); // Set filter options
        console.log("running");
        

    }, [token]);

    // Handle changes in grading inputs
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const numericValue = parseInt(value, 10) || 0;

        const updatedFormData = {
            ...formData,
            [name]: numericValue,
        };

        const total =
            updatedFormData.complexity +
            updatedFormData.usability +
            updatedFormData.innovation +
            updatedFormData.presentation +
            updatedFormData.proficiency;

        setFormData({
            ...updatedFormData,
            total,
        });
    };

    // Handle comment input change
    const handleCommentChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            additionalComment: value,
        });
    };
    const getFilterOptions = () => [
        { value: 'name', label: 'Name' },
        { value: 'Title', label: 'Title' },
        { value: 'WorkshopName', label: 'Workshop Name' },
        { value: 'Project Owners', label: 'Project Owners' },
        { value: 'Lecturer', label: 'Lecturer' },
        { value: 'StudentName', label: 'Student Name' },
        { value: 'StudentEmail', label: 'Student Email' },
        { value: 'StudentPhone', label: 'Student Phone' },
        { value: 'WorkshopId', label: 'Workshop Id' },
    ];

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const confirmation = await MySwal.fire({
            title: 'Confirm Submission',
            text: 'Are you sure you want to submit these grades? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit',
            cancelButtonText: 'Cancel',
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await fetch(`${backendURL}/judge/submitGrade`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        projectId: selectedProject._id,
                        grades: formData,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit grades');
                }

                const data = await response.json();

                MySwal.fire('Success', data.message, 'success');

                // Remove the graded project from the list
                setProjects(projects.filter((project) => project._id !== selectedProject._id));
                setSelectedProject(null);
                resetFormData();
            } catch (error) {
                console.error('Error submitting grades:', error);
                MySwal.fire('Error', 'Failed to submit grades. Please try again.', 'error');
            }
        }
    };

    // Reset form data to initial state
    const resetFormData = () => {
        setFormData({
            complexity: 10,
            usability: 10,
            innovation: 10,
            presentation: 10,
            proficiency: 10,
            additionalComment: '',
            total: 50,
        });
    };

    // Handle search functionality
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault();
        if (searchField && searchTerm) {
            const filteredProjects = projects.filter((project) =>
                project[searchField]
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setProjects(filteredProjects);
            setFiltersActive(true);
        } else {
            MySwal.fire('Error', 'Please select a field and enter a search term.', 'error');
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSearchField('');
        setFiltersActive(false);
        fetchProjects(); // Re-fetch all projects without filters
    };

    // Render loading state
    if (loading) {
        return <Loader>Loading projects...</Loader>;
    }
    return (
        <FeedContainer>
            <BackButton route="/judge" />
            <h2 className="welcome-message">Welcome, {user?.name}! Let's grade some projects.</h2>

            <SearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={handleSearchInputChange}
                onSearchFieldChange={handleSearchFieldChange}
                onSearchButtonClick={handleSearchButtonClick}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
                filterOptions={getFilterOptions} 
            />

            {!selectedProject ? (
                <div className="projects-list">
                    <h3>Select a Project to Grade:</h3>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                onClick={() => setSelectedProject(project)}
                            >
                                <h4>{project.Title}</h4>
                                <p>
                                    <strong>Workshop ID:</strong> {project.WorkshopId}
                                </p>
                            </ProjectCard>
                        ))
                    ) : (
                        <EndMessage>No projects assigned to you at the moment.</EndMessage>
                    )}
                </div>
            ) : (
                <div className="grading-form">
                    <h3>Grading: {selectedProject.Title}</h3>
                    <ProjectGradingForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleCommentChange={handleCommentChange}
                        handleSubmit={handleSubmit}
                        handleBack={() => setSelectedProject(null)}
                    />
                </div>
            )}
        </FeedContainer>
    );
});

export default GradeProjectsFeed;
