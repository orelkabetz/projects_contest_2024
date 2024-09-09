import { observer } from 'mobx-react-lite';
import React from 'react';
import AvailablePreferences from './AvailablePreferences';
import { storages } from '../../stores';
import BackButton from '../../utils/BackButton';
import EditFieldButton from './EditFieldButton';
import JudgeButtons from './JudgeButtons';
import './ProfileSetup.css';




const ProfileSetup = observer(() => {
    const {userStorage} = storages
    const user = userStorage.user

  if (!user) {
    // Handle the case when the user object is null
    return <div>Loading...</div>;
  }

  const updateUser = (field, newValue) => {
    userStorage.user[field] = newValue; // Update local state
  };

  return (
    <div className="profile-setup-container">
      <header className="profile-header">
        <h3>Welcome, Judge {user?.name}!</h3>
        <JudgeButtons />
      </header>
      <h2>Profile Setup</h2>
      <div className="button-column">
      <AvailablePreferences  token={localStorage.getItem('token')} />
        <EditFieldButton className="profile_setup_button" field="email" user={user} updateUser={updateUser} />
        <EditFieldButton className="profile_setup_button" field="password" user={user} updateUser={updateUser} />
        <EditFieldButton className="profile_setup_button" field="name" user={user} updateUser={updateUser} />
      </div>
      <div style={{ height: '40px' }} /> {/* Spacer element */}
      <BackButton className="back-button" route="/judge" />
    </div>
  );
});

export default ProfileSetup;