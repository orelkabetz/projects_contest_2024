import { observer } from 'mobx-react-lite';
import React from 'react';
import ProjectList from '../../ProjectsList'; // Ensure the correct path to ProjectList component
import { storages } from '../../stores'; // Ensure the correct path to the stores
import BackButton from '../../BackButton';

const ViewProjects = observer(() => {
    const { userStorage } = storages;
    const user = userStorage.user;

    if (!user) {
        // Handle the case when the user object is null
        return <div>Loading...</div>;
    }

    return (
        <div>
            <BackButton route="/judge" />
            <h2>View Projects</h2>
            <h3>Welcome, {user.name}!</h3>
            <ProjectList endpoint="http://localhost:3001/admin/projects/projectsList" />
        </div>
    );
});

export default ViewProjects;
