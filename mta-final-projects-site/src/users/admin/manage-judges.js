import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
import BackButton from '../../utils/BackButton';
import ExportData from './export-data';
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';


const ManageJudges = observer(() => {
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
    
            fetch(`${backendURL}/upload/potential_users`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                fetchPotentialJudges(); // Refresh the potential judges list after successful upload
                Swal.fire('Success', 'Potential judges data uploaded successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error uploading potential judges data!', 'error');
            });
        }
    };

    // Function to fetch judges data from the database
    const fetchJudges = () => {
        fetch(`${backendURL}/admin/judges/judgesList`)
            .then(response => response.json())
            .then(data => {
                setJudges(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const fetchPotentialJudges = () => {
        return fetch(`${backendURL}/admin/judges/potentialJudgesList`)
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
        fetch(`${backendURL}/admin/judges/remove-ids`, {
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
        fetch(`${backendURL}/admin/judges/remove-users`, {
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
        fetchPotentialJudges();
    }, []);
    
    const openJudgesListModal = () => {
        Swal.fire({
            title: 'Registered Judges',
            html: '<div id="judgesListContainer"></div>',
            showCancelButton: true,
            confirmButtonText: 'Remove Selected Judges',
            cancelButtonText: 'Close',
            preConfirm: () => {
                const selectedJudges = JSON.parse(localStorage.getItem('selectedJudges')) || [];
                removeSelectedJudges(selectedJudges);
            },
            didOpen: () => {
                renderJudgesList();
            },
        });
    };
    
    const renderJudgesList = () => {
        const judgesListContainer = document.getElementById('judgesListContainer');
        if (judgesListContainer) {
            const root = ReactDOM.createRoot(judgesListContainer);
            root.render(<JudgesList />);
        }
    };
    
    const JudgesList = () => {
        const [filterText, setFilterText] = React.useState('');
        const [selectedJudges, setSelectedJudges] = React.useState([]);
    
        React.useEffect(() => {
          localStorage.setItem('selectedJudges', JSON.stringify(selectedJudges));
        }, [selectedJudges]);
    
        const toggleSelection = (id) => {
          setSelectedJudges((prevSelectedJudges) => {
            if (prevSelectedJudges.includes(id)) {
              return prevSelectedJudges.filter((judgeId) => judgeId !== id);
            } else {
              return [...prevSelectedJudges, id];
            }
          });
        };
    
        return (
          <div>
            <input
              type="text"
              id="filterInput"
              placeholder="Filter by name or ID"
              onChange={(e) => setFilterText(e.target.value)}
            />
            <ul id="judgesList" style={{ listStyleType: 'none', padding: 0 }}>
              {judges
                .filter(
                  (judge) =>
                    judge.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    judge.ID.toString().includes(filterText)
                )
                .map((judge, index) => (
                  <li key={judge.ID} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderRadius: '6px', border: '1px solid #ccc', padding: '10px' }}>
                      <label htmlFor={`judge-${index}`} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                        {judge.name} (ID: {judge.ID})
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minWidth: '45px' }}>
                        <input
                          type="checkbox"
                          id={`judge-${index}`}
                          checked={selectedJudges.includes(judge.ID.toString())}
                          onChange={() => toggleSelection(judge.ID.toString())}
                        />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        );
      };
    
    useEffect(() => {
        renderJudgesList();
    }, [selectedJudges, filterText]);

    const removeSelectedJudges = (selectedJudges) => {
        removeSelectedUsers(selectedJudges);
    };

    const toggleSelection = (judgeId) => {
        const selectedIndex = selectedJudges.indexOf(judgeId);
        let newSelectedJudges = [];

        if (selectedIndex === -1) {
            newSelectedJudges = [...selectedJudges, judgeId];
        } else {
            newSelectedJudges = selectedJudges.filter((selectedId) => selectedId !== judgeId);
        }

        setSelectedJudges(newSelectedJudges);
    };

    const openPotentialJudgesListModal = () => {
        Swal.fire({
            title: 'Potential Judges',
            html: '<div id="potentialJudgesListContainer"></div>',
            showCancelButton: true,
            confirmButtonText: 'Remove Selected Potential Judges',
            cancelButtonText: 'Close',
            preConfirm: () => {
                const selectedIds = JSON.parse(localStorage.getItem('selectedPotentialJudges')) || [];
                removeSelectedIdsInternal(selectedIds);
            },
            didOpen: () => {
                renderPotentialJudgesList();
            },
        });
    };
    
    const renderPotentialJudgesList = () => {
        const potentialJudgesListContainer = document.getElementById('potentialJudgesListContainer');
        if (potentialJudgesListContainer) {
            const root = ReactDOM.createRoot(potentialJudgesListContainer);
            root.render(<PotentialJudgesList />);
        }
    };
    
    const PotentialJudgesList = () => {
        const [filterText, setFilterText] = React.useState('');
        const [selectedIds, setSelectedIds] = React.useState([]);
    
        React.useEffect(() => {
            localStorage.setItem('selectedPotentialJudges', JSON.stringify(selectedIds));
        }, [selectedIds]);
    
        const toggleSelection = (id) => {
            setSelectedIds((prevSelectedIds) => {
                if (prevSelectedIds.includes(id)) {
                    return prevSelectedIds.filter((judgeId) => judgeId !== id);
                } else {
                    return [...prevSelectedIds, id];
                }
            });
        };
    
        return (
            <div>
                <input
                    type="text"
                    id="filterInput"
                    placeholder="Filter by ID"
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <ul id="potentialJudgesList" style={{ listStyleType: 'none', padding: 0 }}>
                    {potentialJudges
                        .filter((judge) => judge.ID.toString().includes(filterText))
                        .map((judge, index) => (
                            <li key={judge.ID} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '10px' }}>
                                    <label htmlFor={`potential-judge-${index}`} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                        ID: {judge.ID}
                                    </label>
                                    <input
                                        type="checkbox"
                                        id={`potential-judge-${index}`}
                                        checked={selectedIds.includes(judge.ID.toString())}
                                        onChange={() => toggleSelection(judge.ID.toString())}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </div>
                            </li>
                        ))}
                </ul>
                <div>
                    <input type="text" id="newIdInput" placeholder="Enter new ID" />
                    <button onClick={addNewId}>Add New ID</button>
                </div>
            </div>
        );
    };
    
    useEffect(() => {
        renderPotentialJudgesList();
    }, [selectedIds, filterText]);
    
    const removeSelectedIdsInternal = (selectedIds) => {
        removeSelectedIds(selectedIds);
    };

    const addNewId = () => {
        const newIdInput = document.getElementById('newIdInput');
        const newId = newIdInput.value.trim();
        if (newId) {
            addNewPotentialJudge(newId, () => {
                newIdInput.value = '';
                fetchPotentialJudges();
            });
        }
    };

    const addNewPotentialJudge = (newId, callback) => {
        fetch(`${backendURL}/admin/judges/add-potential-judge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ID: newId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (callback) {
                    callback(); // Call the callback function after successful insertion
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const addNewPreference = async () => {
        const { value: newPreference } = await Swal.fire({
            title: 'Add New Preference',
            input: 'text',
            inputLabel: 'Preference Name',
            inputPlaceholder: 'Enter the new preference',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a preference name';
                }
            },
        });

        if (newPreference) {
            try {
                const response = await fetch(`${backendURL}/admin/preferences/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ preference: newPreference }),
                });

                if (response.ok) {
                    Swal.fire('Success', 'Preference added successfully!', 'success');
                } else {
                    Swal.fire('Error', 'Failed to add preference', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the preference', 'error');
            }
        }
    };

    const removePreferences = async () => {
        try {
            const response = await fetch(`${backendURL}/admin/preferences`);
            const preferences = await response.json();

            Swal.fire({
                title: 'Remove Preferences',
                html: '<div id="preferencesListContainer"></div>',
                showCancelButton: true,
                confirmButtonText: 'Remove Selected Preferences',
                cancelButtonText: 'Close',
                preConfirm: () => {
                    const selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
                    removeSelectedPreferences(selectedPreferences);
                },
                didOpen: () => {
                    renderPreferencesList(preferences);
                },
            });
        } catch (error) {
            console.error('Error fetching preferences:', error);
            Swal.fire('Error', 'An error occurred while fetching the preferences', 'error');
        }
    };

    const renderPreferencesList = (preferences) => {
        const preferencesListContainer = document.getElementById('preferencesListContainer');
        if (preferencesListContainer) {
            const root = ReactDOM.createRoot(preferencesListContainer);
            root.render(<PreferencesList preferences={preferences} />);
        }
    };

    const PreferencesList = ({ preferences }) => {
        const [selectedPreferences, setSelectedPreferences] = React.useState([]);

        React.useEffect(() => {
            localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
        }, [selectedPreferences]);

        const toggleSelection = (id) => {
            setSelectedPreferences((prevSelectedPreferences) => {
                if (prevSelectedPreferences.includes(id)) {
                    return prevSelectedPreferences.filter((preferenceId) => preferenceId !== id);
                } else {
                    return [...prevSelectedPreferences, id];
                }
            });
        };

        return (
            <div>
                <ul id="preferencesList" style={{ listStyleType: 'none', padding: 0 }}>
                    {preferences.map((preference, index) => (
                        <li key={preference.ID} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '10px' }}>
                                <label htmlFor={`preference-${index}`} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                    {preference.ID}
                                </label>
                                <input
                                    type="checkbox"
                                    id={`preference-${index}`}
                                    checked={selectedPreferences.includes(preference.ID)}
                                    onChange={() => toggleSelection(preference.ID)}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const removeSelectedPreferences = async (selectedPreferences) => {
        try {
            const response = await fetch(`${backendURL}/admin/preferences/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ preferences: selectedPreferences }),
            });

            if (response.ok) {
                Swal.fire('Success', 'Preferences removed successfully!', 'success');
            } else {
                Swal.fire('Error', 'Failed to remove preferences', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'An error occurred while removing the preferences', 'error');
        }
    };

    return (
        <div className="admin-buttons">
            <h1>Manage Judges</h1>
            <h2>Upload Potential Judges CSV</h2>
            <input type="file" onChange={handleFileUpload} accept=".csv" />
            <div>
                <h2>Judges List</h2>
                <button className='admin-button' onClick={openJudgesListModal}>Show Judges List</button>
            </div>
                <h2>Potential Judges List</h2>
                <button className='admin-button' onClick={openPotentialJudgesListModal}>Show Potential Judges List</button>
            <div className="admin-buttons">
                <h2>Preference Subjects Options</h2>
                <button className="admin-button" onClick={addNewPreference}>Add Preference</button>
                <button className="admin-button" onClick={removePreferences}>Remove Preference</button>
                <ExportData url='http://localhost:3001/admin/judges/judgesList' />
                <BackButton route="/admin" />
            </div>
            <AdminButtons />
        </div>
    );
});

export default ManageJudges;
