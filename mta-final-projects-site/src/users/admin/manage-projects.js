import { observer } from 'mobx-react-lite';
import React from 'react';
import ProjectList from '../../ProjectsList'; // Ensure the correct path to ProjectList component
import BackButton from '../../utils/BackButton';
import ExportData from './export-data';
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';
import Swal from 'sweetalert2';

const ManageProjects = observer(() => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch(`${backendURL}/upload/projects`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Upload success:', data);
                alert('Projects data uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error uploading projects data!');
            });
        }
    };

    const handleRemoveProject = async () => {
        const { value: projectNumber } = await Swal.fire({
            title: 'Remove Project',
            input: 'text',
            inputLabel: 'Project Number',
            inputPlaceholder: 'Enter the project number',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a project number!';
                }
            },
        });

        if (projectNumber) {
            try {
                const response = await fetch(`${backendURL}/admin/projects/remove`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ projectNumber:projectNumber }),
                });

                if (response.ok) {
                    Swal.fire('Success', 'Preference added successfully!', 'success');
                } else {
                    Swal.fire('Error', 'Failed to remove project', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the preference', 'error');
            }
        }
    };

    const handleAddNewProject = async () => {
        const fetchWorkshops = async () => {
            try {
                const response = await fetch(`${backendURL}/admin/projects/workshops`);
                if (response.ok) {
                    const workshops = await response.json();
                    return workshops;
                }
            } catch (error) {
                console.error('Error fetching workshops:', error);
            }
            return [];
        };
    
        const workshops = await fetchWorkshops();
    
        const { value: newProject } = await Swal.fire({
            title: '<span style="font-size: 75%; color: #175a94;">Add New Project</span>',
            html: `
                <select id="workshopIdSelect" class="swal2-input" style="font-size: 75%; color: #175a94;">
                    <option value="" disabled selected>Select Workshop</option>
                    ${workshops.map(workshop => `<option value="${workshop.WorkshopId}|${workshop.WorkshopName}">${workshop.WorkshopId} (${workshop.WorkshopName})</option>`).join('')}
                    <option value="new">New Workshop</option>
                </select>
                <input id="projectNumber" class="swal2-input" placeholder="Project Number" style="font-size: 75%; color: #175a94;" />
                <input id="title" class="swal2-input" placeholder="Project Title" style="font-size: 75%; color: #175a94;" />
                <input id="projectOwners" class="swal2-input" placeholder="Project Owners" style="font-size: 75%; color: #175a94;" />
                <input id="projectInfo" class="swal2-input" placeholder="Project Information" style="font-size: 75%; color: #175a94;" />
                <input id="projectImage" class="swal2-input" placeholder="Project Image" style="font-size: 75%; color: #175a94;" />
                <input id="githubLink" class="swal2-input" placeholder="Github link" style="font-size: 75%; color: #175a94;" />
                <input id="courseOfStudy" class="swal2-input" placeholder="Course Of Study" style="font-size: 75%; color: #175a94;" />
                <input id="studentName" class="swal2-input" placeholder="Student Name" style="font-size: 75%; color: #175a94;" />
                <input id="studentEmail" class="swal2-input" placeholder="Student Email" style="font-size: 75%; color: #175a94;" />
                <input id="studentPhone" class="swal2-input" placeholder="Student Phone" style="font-size: 75%; color: #175a94;" />
                <input id="lecturer" class="swal2-input" placeholder="Lecturer" style="font-size: 75%; color: #175a94;" />
                
                <div id="newWorkshopFields" style="display: none;">
                    <input id="newWorkshopId" class="swal2-input" placeholder="New Workshop ID" style="font-size: 75%; color: #175a94;" />
                    <input id="newWorkshopName" class="swal2-input" placeholder="New Workshop Name" style="font-size: 75%; color: #175a94;" />
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '<span style="font-size: 75%;">Save</span>',
            cancelButtonText: '<span style="font-size: 75%;">Cancel</span>',
            didOpen: () => {
                const workshopSelect = document.getElementById('workshopIdSelect');
                const newWorkshopFields = document.getElementById('newWorkshopFields');
    
                // Show or hide new workshop fields based on selection
                workshopSelect.addEventListener('change', (event) => {
                    if (event.target.value === 'new') {
                        newWorkshopFields.style.display = 'block';
                    } else {
                        newWorkshopFields.style.display = 'none';
                    }
                });
            },
            preConfirm: () => {
                const projectNumber = document.getElementById('projectNumber').value;
                const title = document.getElementById('title').value;
                const projectOwners = document.getElementById('projectOwners').value;
                const projectInfo = document.getElementById('projectInfo').value;
                const projectImage = document.getElementById('projectImage').value;
                const githubLink = document.getElementById('githubLink').value;
                const courseOfStudy = document.getElementById('courseOfStudy').value;
                const studentName = document.getElementById('studentName').value;
                const studentEmail = document.getElementById('studentEmail').value;
                const studentPhone = document.getElementById('studentPhone').value;
                const workshopSelectValue = document.getElementById('workshopIdSelect').value;
                const lecturer = document.getElementById('lecturer').value;
                const year = new Date().getFullYear().toString();
    
                if (!projectNumber || !title || !projectOwners || !studentName || !studentEmail || !studentPhone || !workshopSelectValue) {
                    Swal.showValidationMessage('Please fill out all required fields');
                    return false;
                }
    
                let newWorkshop = {};
                let workshopId, workshopName;
    
                if (workshopSelectValue === 'new') {
                    // New workshop selected
                    workshopId = document.getElementById('newWorkshopId').value;
                    workshopName = document.getElementById('newWorkshopName').value;
    
                    if (!workshopId || !workshopName) {
                        Swal.showValidationMessage('Please fill out new workshop details');
                        return false;
                    }
    
                    newWorkshop = { WorkshopId: workshopId, WorkshopName: workshopName };
                } else {
                    // Existing workshop selected
                    [workshopId, workshopName] = workshopSelectValue.split('|');
                }
    
                return {
                    ProjectNumber: projectNumber,
                    Title: title,
                    ProjectOwners: projectOwners,
                    projectInfo: projectInfo,
                    ProjectImage: projectImage,
                    GithubLink: githubLink,
                    StudentName: studentName,
                    StudentEmail: studentEmail,
                    StudentPhone: studentPhone,
                    CourseOfStudy: courseOfStudy,
                    ProjectYear: year,
                    Lecturer: lecturer,
                    WorkshopId: workshopId,
                    WorkshopName: workshopName,
                    ...newWorkshop
                };
            }
        });
    
        if (newProject) {
            try {
                const response = await fetch(`${backendURL}/admin/projects/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProject),
                });
    
                if (response.ok) {
                    Swal.fire('Success', 'Project added successfully!', 'success');
                } else {
                    Swal.fire('Error', 'Failed to add project', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the project', 'error');
            }
        }
    };
    

    const handleEditProject = async () => {
        // Step 1: Ask for Project ID
        const { value: projectId } = await Swal.fire({
            title: 'Edit Project',
            input: 'text',
            inputLabel: 'Project ID',
            inputPlaceholder: 'Enter the project ID',
            showCancelButton: true,
            confirmButtonText: 'Next',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a project ID!';
                }
            },
        });
    
        if (projectId) {
            try {
                const query = `?projectNumber=${encodeURIComponent(projectId)}`;
                console.log(query);
                const response = await fetch(`${backendURL}/admin/projects/getById${query}`);
                
                if (response.ok) {
                    const project = await response.json();
                    
                    const { value: editedProject } = await Swal.fire({
                        title: 'Edit Project',
                        html: `
                            <label>Project Number</label>
                            <input id="projectNumber" class="swal2-input" value="${project.ProjectNumber}" />
                            
                            <label>Title</label>
                            <input id="title" class="swal2-input" value="${project.Title}" />
                            
                            <label>Project Owners</label>
                            <input id="projectOwners" class="swal2-input" value="${project.ProjectOwners}" />
                            
                            <label>Project Information</label>
                            <input id="projectInfo" class="swal2-input" value="${project.ProjectInfo}" />
                            
                            <label>Project Image</label>
                            <input id="projectImage" class="swal2-input" value="${project.ProjectImage}" />
                            
                            <label>Github Link</label>
                            <input id="githubLink" class="swal2-input" value="${project.GithubLink}" />
                            
                            <label>Course Of Study</label>
                            <input id="courseOfStudy" class="swal2-input" value="${project.CourseOfStudy}" />
                            
                            <label>Student Name</label>
                            <input id="studentName" class="swal2-input" value="${project.StudentName}" />
                            
                            <label>Student Email</label>
                            <input id="studentEmail" class="swal2-input" value="${project.StudentEmail}" />
                            
                            <label>Student Phone</label>
                            <input id="studentPhone" class="swal2-input" value="${project.StudentPhone}" />
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Save',
                        cancelButtonText: 'Cancel',
                    });
        
                    if (editedProject) {
                        // Step 5: Submit the Changes
                        try {
                            const updatedProject = {
                                ProjectNumber: document.getElementById('projectNumber').value,
                                Title: document.getElementById('title').value,
                                ProjectOwners: document.getElementById('projectOwners').value,
                                ProjectInfo: document.getElementById('projectInfo').value,
                                ProjectImage: document.getElementById('projectImage').value,
                                GithubLink: document.getElementById('githubLink').value,
                                CourseOfStudy: document.getElementById('courseOfStudy').value,
                                StudentName: document.getElementById('studentName').value,
                                StudentEmail: document.getElementById('studentEmail').value,
                                StudentPhone: document.getElementById('studentPhone').value,
                            };
        
                            const response = await fetch(`${backendURL}/admin/projects/update${query}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(updatedProject),
                            });
        
                            if (response.ok) {
                                Swal.fire('Success', 'Project updated successfully!', 'success');
                            } else {
                                Swal.fire('Error', 'Failed to update project', 'error');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            Swal.fire('Error', 'An error occurred while updating the project', 'error');
                        }
                    }
                } else {
                    Swal.fire('Error', 'Failed to fetch project data', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while fetching the project data', 'error');
            }
        }
    };

    

    return (
        <div className='admin-page-container'>
        <div className='admin-header'>
            <h2>Manage Projects</h2>
            <div className='admin-buttons'>
                <h3>Upload Projects Data</h3>
                <input type="file" onChange={handleFileUpload} accept=".csv" />
                <button className='admin-button' onClick={handleAddNewProject}>Add Project</button>
                <button className='admin-button' onClick={handleRemoveProject}>Remove Project</button>
                <button className='admin-button' onClick={handleEditProject}>Edit Project</button>
                <ExportData url={`${backendURL}/admin/projects/projectsList`} />
            </div>
            <div>
                <BackButton route="/admin" />
            </div>
            <AdminButtons />
        </div>
        </div>
    );
});

export default ManageProjects;
