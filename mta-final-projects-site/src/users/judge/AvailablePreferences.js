import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
import './ProfileSetup.css';
import { backendURL } from '../../config';


const AvailablePreferences = observer(({ token }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  useEffect(() => {
    fetchPreferences();
    fetchUserPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${backendURL}/preferences`);
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
      const response = await fetch(`${backendURL}/preferences/user`, {
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

    Swal.fire({
      title: 'Available Preferences',
      html: '<div id="preferencesListContainer"></div>',
      confirmButtonText: 'OK',
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
    const [localSelectedPreferences, setLocalSelectedPreferences] = useState(selectedPreferences);

    useEffect(() => {
      setSelectedPreferences(localSelectedPreferences);
    }, [localSelectedPreferences]);

    const toggleSelection = (id) => {
      setLocalSelectedPreferences((prevSelectedPreferences) => {
        if (prevSelectedPreferences.includes(id)) {
          handlePreferenceChange(id, false); // false indicates removal
          return prevSelectedPreferences.filter((preferenceId) => preferenceId !== id);
        } else {
          handlePreferenceChange(id, true); // true indicates addition
          return [...prevSelectedPreferences, id];
        }
      });
    };

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

  const handlePreferenceChange = async (preferenceId, isAdding) => {
    try {
      const url = isAdding ? `${backendURL}/preferences/add` : `${backendURL}/preferences/remove`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ preferenceId }),
      });
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error handling preference change:', error);
    }
  };

  return (
    <div>
      <button className="profile_setup_button" onClick={openPreferencesModal}>Edit Preferences</button>
    </div>
  );
});

export default AvailablePreferences;
