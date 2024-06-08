import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactDOM from 'react-dom/client';


const MySwal = withReactContent(Swal);

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
    
            fetch('http://localhost:3001/upload/potential_users', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                fetchPotentialJudges(); // Refresh the potential judges list after successful upload
                MySwal.fire('Success', 'Potential judges data uploaded successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error:', error);
                MySwal.fire('Error', 'Error uploading potential judges data!', 'error');
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
        fetchPotentialJudges();
    }, []);
    
    const openJudgesListModal = () => {
        MySwal.fire({
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
        MySwal.fire({
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
    
    React.useEffect(() => {
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
                if (callback) {
                    callback(); // Call the callback function after successful insertion
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
          <h1>Manage Judges</h1>
          <div>
            <h2>Upload Potential Judges CSV</h2>
            <input type="file" onChange={handleFileUpload} accept=".csv" />
          </div>
          <div>
            <h2>Judges List</h2>
            <button onClick={openJudgesListModal}>Show Judges List</button>
          </div>
          <div>
            <h2>Potential Judges List</h2>
            <button onClick={openPotentialJudgesListModal}>Show Potential Judges List</button>
          </div>
        </div>
      );
    });

export default ManageJudges;