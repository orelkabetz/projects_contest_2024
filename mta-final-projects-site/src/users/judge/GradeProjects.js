import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Swal from 'sweetalert2'; 
import { storages } from '../../stores';
import Post from '../../utils/Post'; 
import BackButton from '../../utils/BackButton';
import SearchBar from '../../utils/SearchBar';
import ProjectGradingForm from './ProjectGradingForm';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import JudgeButtons from './JudgeButtons';
import { backendURL } from '../../config';

// Initial form data state
const initialFormData = {
    complexity: 10,
    usability: 10,
    innovation: 10,
    presentation: 10,
    proficiency: 10,
    additionalComment: '',
    total: 50,
};

// Styled components for the FeedContainer
const FeedContainer = styled.div`
    background-color: #f0f8ff; 
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        padding: 15px;
        max-width: 100%;
    }
`;

const Loader = styled.h4`
    color: #175a94; 
    text-align: center;

    /* Adjust font size for mobile */
    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

const EndMessage = styled.p`
    color: #555;
    text-align: center;

    /* Adjust font size for mobile */
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const StyledCancelButton = styled(Button)`
  background-color: #d33 !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: bold !important;
  margin-top: 8px !important;
  &:hover {
    background-color: #c82333 !important;
  }
`;

const StyledSubmitButton = styled(Button)`
  background-color: #175a94 !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: bold !important;
  margin-top: 8px !important;
  &:hover {
    background-color: #0e3f6d !important;
  }
  }
`;

const DialogActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  }
`;

const GradeProjects = observer(() => {
    const { userStorage } = storages;
    const user = userStorage.user;
    const token = localStorage.getItem('token');

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState(initialFormData);  // Use initial state
    const [loading, setLoading] = useState(true);
    const [filtersActive, setFiltersActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchProjects = async (query = '') => {
        try {
            setLoading(true);
            const response = await fetch(`${backendURL}/projectsForJudge/projectList${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            Swal.fire('Error', 'Failed to fetch projects. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [token]);

    const handleOpenDialog = (project) => {
        setSelectedProject(project);
        setFormData(initialFormData);  // Reset form data to initial values when opening dialog
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedProject(null);
        setDialogOpen(false);
        setFormData(initialFormData);  // Reset form data on close
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const query = `?token=${token}&projectId=${selectedProject.ProjectNumber}`;
    
            const response = await fetch(`${backendURL}/gradeProject${query}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                
                if (response.status === 400) {
                    setDialogOpen(false);  // Ensure the dialog is closed
                    Swal.fire('Error', errorData.error || 'Grade for this project already exists.', 'error');
                    return;
                }
    
                throw new Error(errorData.message || 'Failed to submit grades');
            }
    
            const data = await response.json();
            console.log('Submission successful:', data.message);
    
            setDialogOpen(false);  // Close dialog after successful submission
            Swal.fire('Success', 'Grade submitted successfully!', 'success');
        } catch (error) {
            console.error('Error submitting grades:', error.message);
            Swal.fire('Error', error.message, 'error');
        }
    };
    
    
    const handleCancelClick = () => {
        setDialogOpen(false);  // Close the dialog before showing the Swal confirmation

        Swal.fire({
            title: 'Are you sure?',
            text: "You will lose all the unsaved changes.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
        }).then((result) => {
            if (!result.isConfirmed) {
                setDialogOpen(true);  // Reopen the dialog if the user decides not to cancel
            }
        });
    };

    if (loading) {
        return <Loader>Loading projects...</Loader>;
    }

    return (
        <FeedContainer>
            <header className="py-6 bg-white text-center border-b border-gray-200">
                <h3 className="text-blue-700 text-lg">Welcome, {user?.name}! Let's grade some projects.</h3>
                <JudgeButtons />
            </header>
            <BackButton route="/judge" />
            <SearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={(e) => setSearchTerm(e.target.value)}
                onSearchFieldChange={(e) => setSearchField(e.target.value)}
                onSearchButtonClick={handleSubmit}
                onClearFilters={handleCloseDialog}
                filtersActive={filtersActive}
            />

            <div className="projects-list">
                <h3>Select a Project to Grade:</h3>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <Post
                            key={project._id}
                            project={project}
                            onGrade={() => handleOpenDialog(project)}
                            showGradeButton={true}
                        />
                    ))
                ) : (
                    <EndMessage>No projects assigned to you at the moment.</EndMessage>
                )}
            </div>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>Grading: {selectedProject?.Title}</DialogTitle>
                <DialogContent>
                    <ProjectGradingForm
                        formData={formData}
                        handleSelectChange={(e) => {
                            const { name, value } = e.target;
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                [name]: parseInt(value, 10),
                                total:
                                    prevFormData.complexity +
                                    prevFormData.usability +
                                    prevFormData.innovation +
                                    prevFormData.presentation +
                                    prevFormData.proficiency,
                            }));
                        }}
                        handleCommentChange={(e) => setFormData({ ...formData, additionalComment: e.target.value })}
                        handleSubmit={handleSubmit}
                        handleCancelClick={handleCancelClick}
                    />
                </DialogContent>
                <DialogActionsContainer>
                  <StyledCancelButton onClick={handleCancelClick}>
                    Cancel
                  </StyledCancelButton>
                  <StyledSubmitButton variant="contained" type="submit" onClick={handleSubmit}>
                    Finish Grading
                  </StyledSubmitButton>
                </DialogActionsContainer>
            </Dialog>
        </FeedContainer>
    );
});

export default GradeProjects;
