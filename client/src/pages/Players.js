import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext'; // To potentially check user role

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({ name: '', jerseyNumber: '', position: '', profileColor: '#007bff' });
    const [editingPlayerId, setEditingPlayerId] = useState(null);
    const [selectedPlayerColor, setSelectedPlayerColor] = useState('#ffffff');
    const [playerToChangeColor, setPlayerToChangeColor] = useState('');

    const { user } = useContext(AuthContext); // Get logged-in user info

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/players');
            setPlayers(res.data);
        } catch (err) {
            console.error("Error fetching players:", err);
        }
    };

    const handleNewPlayerChange = e => {
        setNewPlayer({ ...newPlayer, [e.target.name]: e.target.value });
    };

    const handleAddPlayer = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/players', newPlayer);
            setPlayers([...players, res.data]);
            setNewPlayer({ name: '', jerseyNumber: '', position: '', profileColor: '#007bff' }); // Reset form
        } catch (err) {
            console.error("Error adding player:", err.response ? err.response.data : err.message);
            alert('Failed to add player: ' + (err.response && err.response.data.msg ? err.response.data.msg : 'Server Error'));
        }
    };

    const handleDeletePlayer = async (id) => {
        if (window.confirm('Are you sure you want to delete this player?')) {
            try {
                await axios.delete(`http://localhost:5000/api/players/${id}`);
                setPlayers(players.filter(player => player._id !== id));
            } catch (err) {
                console.error("Error deleting player:", err.response ? err.response.data : err.message);
                alert('Failed to delete player: ' + (err.response && err.response.data.msg ? err.response.data.msg : 'Server Error'));
            }
        }
    };

    const handleColorChange = async (e) => {
        e.preventDefault();
        if (!playerToChangeColor || !selectedPlayerColor) {
            alert('Please select a player and a color.');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/players/${playerToChangeColor}/color`, { profileColor: selectedPlayerColor });
            setPlayers(players.map(player => player._id === playerToChangeColor ? res.data : player));
            alert('Player color updated!');
            // Optionally reset selection
            setPlayerToChangeColor('');
            setSelectedPlayerColor('#ffffff');
        } catch (err) {
            console.error("Error updating color:", err.response ? err.response.data : err.message);
            alert('Failed to update color: ' + (err.response && err.response.data.msg ? err.response.data.msg : 'Server Error'));
        }
    };

    // Simple color palette for selection
    const colorPalette = [
        '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2', '#fd7e14', '#e83e8c', '#6c757d', '#343a40'
    ];

    const canManagePlayers = user && (user.role === 'coach' || user.role === 'captain');

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
                <h1 style={{ color: '#333', marginBottom: '30px' }}>Manage Players</h1>

                {canManagePlayers && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        {/* Add New Player Form */}
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
                            <h2 style={{ marginBottom: '20px', color: '#555' }}>Add New Player</h2>
                            <form onSubmit={handleAddPlayer}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Full Name:</label>
                                    <input type="text" name="name" value={newPlayer.name} onChange={handleNewPlayerChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Jersey Number:</label>
                                    <input type="number" name="jerseyNumber" value={newPlayer.jerseyNumber} onChange={handleNewPlayerChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Position:</label>
                                    <input type="text" name="position" value={newPlayer.position} onChange={handleNewPlayerChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                {/* Initial color picker (optional, default will be used) */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Initial Profile Color:</label>
                                    <input type="color" name="profileColor" value={newPlayer.profileColor} onChange={handleNewPlayerChange} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '4px' }} />
                                </div>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Player</button>
                            </form>
                        </div>

                        {/* Customize Profile Colors */}
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
                            <h2 style={{ marginBottom: '20px', color: '#555' }}>Customize Profile Colors</h2>
                            <form onSubmit={handleColorChange}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Select Player:</label>
                                    <select
                                        value={playerToChangeColor}
                                        onChange={(e) => setPlayerToChangeColor(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    >
                                        <option value="">-- Choose a player --</option>
                                        {players.map(player => (
                                            <option key={player._id} value={player._id}>{player.name} (#{player.jerseyNumber})</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Choose New Color:</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                        {colorPalette.map(color => (
                                            <div
                                                key={color}
                                                onClick={() => setSelectedPlayerColor(color)}
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    backgroundColor: color,
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    border: selectedPlayerColor === color ? '2px solid #333' : '1px solid #ccc',
                                                    boxShadow: selectedPlayerColor === color ? '0 0 0 2px ' + color : 'none'
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <input type="color" value={selectedPlayerColor} onChange={(e) => setSelectedPlayerColor(e.target.value)} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '4px' }} />
                                </div>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Apply Color</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Player List */}
                <h2 style={{ marginBottom: '20px', color: '#555' }}>Team Roster</h2>
                {players.length === 0 ? (
                    <p>No players in the roster.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {players.map(player => (
                            <div key={player._id} style={{
                                backgroundColor: player.profileColor,
                                color: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{player.name}</h3>
                                    <p style={{ margin: '0' }}>Jersey: #{player.jerseyNumber}</p>
                                    <p style={{ margin: '0' }}>Position: {player.position}</p>
                                </div>
                                {canManagePlayers && (
                                    <button
                                        onClick={() => handleDeletePlayer(player._id)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            fontSize: '0.9em'
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Players;