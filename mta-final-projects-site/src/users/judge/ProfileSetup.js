import { observer } from 'mobx-react-lite';
import React from 'react';
import AvailablePreferences from './AvailablePreferences';
import { useStore } from '../../stores';
import BackButton from '../../BackButton';


const ProfileSetup = observer(() => {
    const {userStore} = useStore()
    const user = userStore.user

  if (!user) {
    // Handle the case when the user object is null
    return <div>Loading...</div>;
  }

  return (
    <div>
        <BackButton route="/judge"/>
      <h2>Profile Setup</h2>
      <h3>Welcome, {user.name}!</h3>
      <AvailablePreferences token={localStorage.getItem('token')} />
    </div>
  );
});

export default ProfileSetup;