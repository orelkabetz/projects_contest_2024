import React, { useState, useEffect } from 'react';

const ManageJudges = () => {
    const [judges, setJudges] = useState([]);
    const [potentialJudges, setPotentialJudges] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedJudges, setSelectedJudges] = useState([]);
    const [filterText, setFilterText] = useState('');

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
    
            fetch('http://localhost:3001/upload/potential_users', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                fetchPotentialJudges(); // Refresh the potential judges list after successful upload
                alert('Potential judges data uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error uploading potential judges data!');
            });
        }
    };

    // Function to fetch judges data from the database
    const fetchJudges = () => {
        fetch('http://localhost:3001/admin/judges/judgesList')
            .then(response => response.json())
            .then(data => {
                setJudges(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const fetchPotentialJudges = () => {
        return fetch('http://localhost:3001/admin/judges/potentialJudgesList')
            .then(response => response.json())
            .then(data => {
                setPotentialJudges(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Function to remove selected IDs from the database
    const removeSelectedIds = (selectedPotentialJudges) => {
        const potentialUserIds = selectedPotentialJudges;
        console.log(potentialUserIds);
        fetch('http://localhost:3001/admin/judges/remove-ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: potentialUserIds }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setSelectedIds([]);
                fetchPotentialJudges(); // Refresh the potential judges data after removal
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Function to remove selected users from the database
    const removeSelectedUsers = (selectedJudges) => {
        const userIds = selectedJudges;
        console.log(selectedJudges);

        fetch('http://localhost:3001/admin/judges/remove-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: userIds }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setSelectedJudges([]);
                fetchJudges(); // Refresh the judges data after removal
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchJudges();
        window.removeSelectedUsers = removeSelectedUsers;
        window.removeSelectedIds = removeSelectedIds;
        window.addNewPotentialJudge = addNewPotentialJudge;
    }, []);
    
    const openJudgesListWindow = () => {
        const judgesListWindow = window.open('', 'Judges List', 'width=600,height=400');
        
        fetchJudges();
    
        judgesListWindow.document.write(`
        <html>
        <head>
            <title>Judges List</title>
            <style>
                .selected {
                    background-color: #f0f0f0;
                }
            </style>
        </head>
        <body>
            <h2>Registered Judges</h2>
            <input type="text" id="filterInput" placeholder="Filter by name or ID" oninput="filterJudges()">
            <ul id="judgesList">
                ${judges.map((judge, index) => `
                    <li>
                        <input type="checkbox" id="judge-${index}" ${selectedJudges.includes(judge.ID.toString()) ? 'checked' : ''} onchange="toggleSelection('${judge.ID.toString()}', ${index})">
                        <label for="judge-${index}">Name: ${judge.name}, ID: ${judge.ID}</label>
                    </li>
                `).join('')}
            </ul>
            <button onclick="removeSelectedJudges()">Remove Selected judges</button>
            <button onclick="window.close()">Close</button>
    
                    <script>
                        const selectedJudges = ${JSON.stringify(selectedJudges)};
    
                        function toggleSelection(judgeId, index) {
                            const checkbox = document.getElementById('judge-' + index);
                            const isChecked = checkbox.checked;
                        
                            if (isChecked) {
                                selectedJudges.push(judgeId);
                            } else {
                                const index = selectedJudges.indexOf(judgeId);
                                if (index > -1) {
                                    selectedJudges.splice(index, 1);
                                }
                            }
                            console.log('Selected Judges:', selectedJudges);
                        }
    
                        function removeSelectedJudges() {
                            console.log('Removing Selected Judges:', selectedJudges);
                            window.opener.removeSelectedUsers(selectedJudges);
                             window.close();

                        }
    
                        function filterJudges() {
                            const filterText = document.getElementById('filterInput').value.toLowerCase();
                            const judgeItems = document.getElementById('judgesList').children;
    
                            for (const judgeItem of judgeItems) {
                                const judgeName = judgeItem.querySelector('label').textContent.toLowerCase();
                                const isMatch = judgeName.includes(filterText);
                                judgeItem.style.display = isMatch ? 'block' : 'none';
                            }
                        }
                    </script>
                </body>
            </html>
        `);
    };

    const openPotentialJudgesListWindow = () => {
        const potentialJudgesListWindow = window.open('', 'Potential Judges List', 'width=600,height=400');
        fetchPotentialJudges();
        console.log(potentialJudges);
        potentialJudgesListWindow.document.write(`
            <html>
            <head>
                <title>Potential Judges List</title>
                <style>
                    .selected {
                        background-color: #f0f0f0;
                    }
                </style>
            </head>
            <body>
                <h2>Potential Judges</h2>
                <input type="text" id="filterInput" placeholder="Filter by ID" oninput="filterJudges()">
                <ul id="potentialJudgesList">
                    ${potentialJudges.map((judge, index) => `
                        <li>
                            <input type="checkbox" id="judge-${index}" ${selectedJudges.includes(judge.ID.toString()) ? 'checked' : ''} onchange="toggleSelection('${judge.ID.toString()}', ${index})">
                            <label for="judge-${index}">ID: ${judge.ID}</label>
                        </li>
                    `).join('')}
                </ul>
                <div>
                    <input type="text" id="newIdInput" placeholder="Enter new ID">
                    <button onclick="addNewId()">Add New ID</button>
                </div>
                <button onclick="removeSelectedIds()">Remove Selected Potential Judges</button>
                <button onclick="window.close()">Close</button>
    
                    <script>
                        const selectedJudges = ${JSON.stringify(selectedJudges)};
    
                        function toggleSelection(judgeId, index) {
                            const checkbox = document.getElementById('judge-' + index);
                            const isChecked = checkbox.checked;
                        
                            if (isChecked) {
                                selectedJudges.push(judgeId);
                            } else {
                                const index = selectedJudges.indexOf(judgeId);
                                if (index > -1) {
                                    selectedJudges.splice(index, 1);
                                }
                            }
                            console.log('Selected Judges:', selectedJudges);
                        }
    
                        function removeSelectedIds() {
                            console.log('Removing Selected Judges:', selectedJudges);
                            window.opener.removeSelectedIds(selectedJudges);
                             window.close();

                        }
    
                        function filterJudges() {
                            const filterText = document.getElementById('filterInput').value.toLowerCase();
                            const judgeItems = document.getElementById('judgesList').children;
    
                            for (const judgeItem of judgeItems) {
                                const judgeName = judgeItem.querySelector('label').textContent.toLowerCase();
                                const isMatch = judgeName.includes(filterText);
                                judgeItem.style.display = isMatch ? 'block' : 'none';
                            }
                        }

                        function addNewId(callback) {
                            const newIdInput = document.getElementById('newIdInput');
                            const newId = newIdInput.value.trim();
                            if (newId) {
                                window.opener.addNewPotentialJudge(newId, callback);
                                newIdInput.value = '';
                            }
                        }
        
                        function refreshList() {
                            window.opener.fetchPotentialJudges()
                                .then(() => {
                                    window.location.reload(); // Reload the popup window to update the list
                                });
                        }
                    </script>
                </body>
            </html>
        `);
    };

    const applySelectedJudges = (selectedJudges) => {
        setSelectedJudges(selectedJudges);
    };

    const addNewPotentialJudge = (newId, callback) => {
        fetch('http://localhost:3001/admin/judges/add-potential-judge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ID: newId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                fetchPotentialJudges(); // Refresh the potential judges list after adding a new ID
                if (callback) {
                    callback(); // Call the callback function after successful insertion
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Fetch judges data when the component mounts
    

    return (
        <div>
            <h1>Manage Judges</h1>
            <div>
                <h2>Upload Potential Judges csv</h2>
                <input type="file" onChange={handleFileUpload} accept=".csv" />
            </div>
            <div>
                <h2>Judges List</h2>
                <button onClick={openJudgesListWindow}>Show Judges List</button>
            </div>
            <div>
                <h2>Potential Judges List</h2>
                <button onClick={openPotentialJudgesListWindow}>Show Potential Judges List</button>
            </div>
        </div>
    );
};

export default ManageJudges;