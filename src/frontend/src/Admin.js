import React, {useContext, useEffect, useState } from 'react';
import { WalletContext } from './WalletContext';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
    const { position, joinQueue, advanceQueue, fetchCandidates, vote, candidates } = useContext(WalletContext);
    const [users, setUsers] = useState([]);
    const [isQueueJoined, setIsQueueJoined] = useState(false);


    useEffect(() => {
        fetchCandidates();
        fetchUsers();
    }, [fetchCandidates]);

    const handleVote = async (candidateId) => {
        await vote(candidateId);
        await advanceQueue();
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const updateRole = async (userId, newRole) => {
        try {
            const response = await axios.post('http://localhost:5000/admin/updateRole', { user_id: userId, new_role: newRole });
            alert(response.data.message);
            await fetchUsers(); // Refresh the user list after updating the role
        } catch (error) {
            console.error('Failed to update role', error);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        updateRole(userId, newRole);
    };

    const handleJoinQueue = async () => {
        await joinQueue();
        setIsQueueJoined(true);
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Users</h2>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>
                                <select value={user.role} onChange={(e) => updateRole(user.user_id, e.target.value)}>
                                    <option value="admin">Admin</option>
                                    <option value="voter">Voter</option>
                                    <option value="candidate">Candidate</option>
                                    <option value="user">User</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                {position !== null && <p>Queue Position: {position}</p>}
                {!isQueueJoined && <button onClick={handleJoinQueue}>Join Queue</button>}
                {position === 1 && (
                    <div>
                        <h2>Vote for a Candidate</h2>
                        <table className="candidates-table">
                            <thead>
                            <tr>
                                <th>Candidate Name</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {candidates.map((candidate) => (
                                <tr key={candidate.id}>
                                    <td>{candidate.name}</td>
                                    <td>
                                        <button onClick={() => handleVote(candidate.id)}>Vote</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;