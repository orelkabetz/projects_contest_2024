import React from 'react';

const ProfileSetup = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <h2>Profile Setup</h2>
            <h3>Welcome, {user.name}!</h3>
        </div>
    );
};

export default ProfileSetup;