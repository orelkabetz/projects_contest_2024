import React from 'react';

const ViewProjects = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <h2>View Projects</h2>
            <h3>Welcome, {user.name}!</h3>
        </div>
    );
};

export default ViewProjects;