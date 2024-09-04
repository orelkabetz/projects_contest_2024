import React from 'react';
import { useNavigate } from 'react-router-dom';
import {observer} from "mobx-react-lite"
import { storages } from '../../stores';
import AdminButtons from './AdminButtons';
import Feed from '../../utils/Feed';


const AdminHome = observer(() => {
    const navigate = useNavigate();
    const { userStorage } = storages;
    const user = userStorage.user;

    const handleButtonClick = (route) => {
        navigate(route);
    };
    return (
        <div className="max-w-3xl mx-auto p-6 bg-blue-50">
            <header className="py-6 bg-white text-center border-b border-gray-200">
            
                <h3 className="text-blue-700 text-lg">Welcome, Admin {user?.name}!</h3>
                <AdminButtons />
            </header>
            <Feed />
        </div>
    );
});

export  {AdminHome};