import { observer } from 'mobx-react-lite';
import React from 'react';
import AvailablePreferences from './AvailablePreferences';
import { storages } from '../../stores';
import BackButton from '../../utils/BackButton';
import EditFieldButton from './EditFieldButton';
import JudgeButtons from './JudgeButtons';



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
      <header className="py-6 bg-white text-center border-b border-gray-200">
          
          <h3 className="text-blue-700 text-lg">Welcome, Judge {user?.name}!</h3>
          <JudgeButtons />
      </header>
      <h2>Profile Setup</h2>
      <h3>Welcome, {user.name}!</h3>
      <AvailablePreferences token={localStorage.getItem('token')} />
      <p><EditFieldButton field="email" user={user} updateUser={updateUser} /></p>
        <p><EditFieldButton field="password" user={user} updateUser={updateUser} /></p>
        <p> <EditFieldButton field="company" user={user} updateUser={updateUser} /></p>
        <p><EditFieldButton field="name" user={user} updateUser={updateUser} /></p>
        <BackButton route="/judge"/>
    </div>
  );
});

export default ProfileSetup;