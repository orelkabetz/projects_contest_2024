import React, { useState, useEffect } from 'react';

const ManageJudges = () => {
    const [judges, setJudges] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // API call to the backend to upload judges data
            fetch('/upload/potential_users', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setJudges(data); // Update the judges state with the response data
                alert('Judges data uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error uploading judges data!');
            });
        }
    };

    // Function to fetch judges data from the database
    const fetchJudges = () => {
        fetch('http://localhost:3001/judges')
            .then(response => response.json())
            .then(data => {
                setJudges(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Function to remove selected IDs from the database
    const removeSelectedIds = () => {
        fetch('http://localhost:3001/admin/judges/remove-ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedIds }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setSelectedIds([]);
                fetchJudges(); // Refresh the judges data after removal
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Function to remove selected users from the database
    const removeSelectedUsers = () => {
        fetch('http://localhost:3001/admin/judges/remove-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: selectedUsers }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setSelectedUsers([]);
                fetchJudges(); // Refresh the judges data after removal
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Fetch judges data when the component mounts
    useEffect(() => {
        fetchJudges();
    }, []);

    return (
        <div>
            <h1>Manage Judges</h1>
            <div>
                <h2>Upload Judges Data</h2>
                <input type="file" onChange={handleFileUpload} accept=".csv" />
            </div>
            <div>
                <h2>Judges List</h2>
                {judges.length > 0 ? (
                    <ul>
                        {judges.map((judge, index) => (
                            <li key={index}>{judge.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No judges data available.</p>
                )}
            </div>
            <div>
                <h2>Remove Selected IDs</h2>
                <input
                    type="text"
                    value={selectedIds.join(',')}
                    onChange={e => setSelectedIds(e.target.value.split(','))}
                    placeholder="Enter IDs separated by commas"
                />
                <button onClick={removeSelectedIds}>Remove IDs</button>
            </div>
            <div>
                <h2>Remove Selected Users</h2>
                <input
                    type="text"
                    value={selectedUsers.join(',')}
                    onChange={e => setSelectedUsers(e.target.value.split(','))}
                    placeholder="Enter usernames separated by commas"
                />
                <button onClick={removeSelectedUsers}>Remove Users</button>
            </div>
        </div>
    );
};

export default ManageJudges;