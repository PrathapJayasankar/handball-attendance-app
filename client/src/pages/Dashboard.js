import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar'; // We'll create this next

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/players');
                setPlayers(res.data);
            } catch (err) {
                console.error("Error fetching players:", err);
            }
        };
        fetchPlayers();
    }, []);

    if (loading) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h1 style={{ color: '#333' }}>Welcome, {user ? user.username : 'Guest'}! ({user ? user.role : ''})</h1>
                <p>This is your team dashboard. Here you can see player stats, manage attendance, and more.</p>

                <h2 style={{ marginTop: '30px', color: '#555' }}>Current Team Roster</h2>
                {players.length === 0 ? (
                    <p>No players added yet. Go to the Players page to add some!</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {players.map(player => (
                            <div key={player._id} style={{
                                backgroundColor: player.profileColor,
                                color: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>
                                <h3>{player.name}</h3>
                                <p>Jersey: #{player.jerseyNumber}</p>
                                <p>Position: {player.position}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;