import React from 'react';
import Swal from 'sweetalert2';

const LogoutButton = () => {
    const handleLogout = () => {
        Swal.fire({
            title: 'Confirm Logout',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout'
        }).then((result) => {
            if (result.isConfirmed) {
                // Clear localStorage
                localStorage.clear();
                
                // Reload the page to restart the app
                window.location.reload();
            }
        });
    };

    return (
        <div
            style={{
                background: 'red',
                display: 'inline-block',
                padding: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            }}
            onClick={handleLogout}
        >
            <span style={{ margin: '10px' }}>Logout</span>
        </div>
    );
};

export default LogoutButton;
