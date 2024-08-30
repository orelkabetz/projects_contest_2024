// JudgeHome.js
import React from 'react';
import JudgeButtons from './JudgeButtons';
import { storages } from '../../stores';
import { observer } from 'mobx-react-lite';
import Feed from '../../utils/Feed';

const JudgeHome = observer(() => {
    const { userStorage } = storages;
    const user = userStorage.user;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-blue-50">
            <header className="py-6 bg-white text-center border-b border-gray-200">
            
                <h3 className="text-blue-700 text-lg">Welcome, Judge {user?.name}!</h3>
                <JudgeButtons />
            </header>
            <Feed />
        </div>
    );
});

export default JudgeHome;