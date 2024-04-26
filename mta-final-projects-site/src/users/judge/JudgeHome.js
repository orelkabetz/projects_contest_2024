import React from 'react';
import JudgeButtons from './JudgeButtons'; // Import JudgeButtons component

const JudgeHome = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <h2>Judge Dashboard</h2>
            <h3>Welcome, {user.name}!</h3>
            <JudgeButtons /> {/* Add JudgeButtons component */}
        </div>
    );
};

export default JudgeHome;
