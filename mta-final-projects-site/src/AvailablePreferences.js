import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactDOM from 'react-dom/client';

const MySwal = withReactContent(Swal);

const AvailablePreferences = observer(({ token }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  useEffect(() => {
    fetchPreferences();
    fetchUserPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('http://localhost:3001/preferences');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPreferences(data);
      } else {
        console.error('Preferences data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('http://localhost:3001/preferences/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setSelectedPreferences(data);
      } else {
        console.error('User preferences data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const openPreferencesModal = async () => {
    await fetchPreferences();
    await fetchUserPreferences();

    MySwal.fire({
      title: 'Available Preferences',
      html: '<div id="preferencesListContainer"></div>',
      showCancelButton: true,
      confirmButtonText: 'Save Preferences',
      cancelButtonText: 'Close',
      preConfirm: () => {
        saveSelectedPreferences(selectedPreferences);
      },
      didOpen: () => {
        renderPreferencesList();
      },
    });
  };

  const renderPreferencesList = () => {
    const preferencesListContainer = document.getElementById('preferencesListContainer');
    if (preferencesListContainer) {
      const root = ReactDOM.createRoot(preferencesListContainer);
      root.render(<PreferencesList selectedPreferences={selectedPreferences} />);
    }
  };

  const PreferencesList = ({ selectedPreferences }) => {
    const [localSelectedPreferences, setLocalSelectedPreferences] = React.useState(selectedPreferences);

    const toggleSelection = (id) => {
      setLocalSelectedPreferences((prevSelectedPreferences) => {
        if (prevSelectedPreferences.includes(id)) {
          return prevSelectedPreferences.filter((preferenceId) => preferenceId !== id);
        } else {
          return [...prevSelectedPreferences, id];
        }
      });
    };

    useEffect(() => {
      setSelectedPreferences(localSelectedPreferences);
    }, [localSelectedPreferences]);

    if (!Array.isArray(preferences)) {
      return <div>Preferences data is not available.</div>;
    }

    return (
      <div>
        <ul id="preferencesList" style={{ listStyleType: 'none', padding: 0 }}>
          {preferences.map((preference, index) => (
            <li key={preference.ID} style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  padding: '10px',
                }}
              >
                <label
                  htmlFor={`preference-${index}`}
                  style={{
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    margin: 0,
                  }}
                >
                  {preference.ID}
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minWidth: '45px',
                  }}
                >
                  <input
                    type="checkbox"
                    id={`preference-${index}`}
                    checked={localSelectedPreferences.includes(preference.ID)}
                    onChange={() => toggleSelection(preference.ID)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const saveSelectedPreferences = async (selectedPreferences) => {
    try {
      const response = await fetch('http://localhost:3001/preferences/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences: selectedPreferences }),
      });
      const data = await response.json();
      console.log('Success:', data);
      setSelectedPreferences(selectedPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div>
      <button onClick={openPreferencesModal}>Edit Preferences</button>
      
    </div>
  );
});

export default AvailablePreferences;