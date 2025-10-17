import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const authLinks = (
        <>
            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
            <Link to="/players" style={navLinkStyle}>Players</Link>
            {/* Add more links for attendance, etc. */}
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            {user && <span style={userStyle}>Logged in as: {user.username} ({user.role})</span>}
        </>
    );

    const guestLinks = (
        <>
            <Link to="/login" style={navLinkStyle}>Login</Link>
        </>
    );

    return (
        <nav style={navbarStyle}>
            <h1 style={logoStyle}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Handball Hub</Link></h1>
            <div style={linksContainerStyle}>
                {isAuthenticated ? authLinks : guestLinks}
            </div>
        </nav>
    );
};

const navbarStyle = {
    backgroundColor: '#333',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
};

const logoStyle = {
    margin: 0,
    fontSize: '1.8rem'
};

const linksContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
};

const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#555'
    }
};

const logoutButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#c82333'
    }
};

const userStyle = {
    marginLeft: '10px',
    fontSize: '0.9rem',
    color: '#ccc'
};


export default Navbar;