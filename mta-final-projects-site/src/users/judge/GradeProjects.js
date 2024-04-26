import React from 'react';

const GradeProjects = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <h2>Grade Projects</h2>
            <h3>Welcome, {user.name}!</h3>
        </div>
    );
};

export default GradeProjects;