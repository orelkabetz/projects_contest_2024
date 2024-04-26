import React from 'react';
import './JudgeButtons.css'; // Import CSS file for styling


const JudgeButtons = () => {
    return (
        <div className="judge-buttons">
            <button className="judge-button">Profile Setup</button>
            <button className="judge-button">View Projects</button>
            <button className="judge-button">Grade Projects</button>
        </div>
    );
};

export default JudgeButtons;
