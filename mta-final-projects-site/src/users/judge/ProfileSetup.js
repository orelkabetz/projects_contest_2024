import { observer } from 'mobx-react-lite';
import React from 'react';
import AvailablePreferences from './AvailablePreferences';
import { storages } from '../../stores';
import BackButton from '../../BackButton';
import EditFieldButton from './EditFieldButton';



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
    <div>
        <BackButton route="/judge"/>
      <h2>Profile Setup</h2>
      <h3>Welcome, {user.name}!</h3>
      <AvailablePreferences token={localStorage.getItem('token')} />
      <p><EditFieldButton field="email" user={user} updateUser={updateUser} /></p>
        <p><EditFieldButton field="password" user={user} updateUser={updateUser} /></p>
        <p> <EditFieldButton field="company" user={user} updateUser={updateUser} /></p>
        <p><EditFieldButton field="name" user={user} updateUser={updateUser} /></p>
    </div>
  );
});

export default ProfileSetup;