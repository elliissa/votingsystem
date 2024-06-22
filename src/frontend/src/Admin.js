import React, {useContext, useEffect, useState } from 'react';
import { WalletContext } from './WalletContext';
import axios from 'axios';

const Admin = () => {
    const { position, joinQueue, advanceQueue, fetchCandidates, vote, candidates } = useContext(WalletContext);
    const [users, setUsers] = useState([]);

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

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {position !== null && <p>Queue Position: {position}</p>}
            <button onClick={joinQueue}>Join Queue</button>
            {position === 1 && (
                <div>
                    <h2>Vote for a Candidate</h2>
                    {candidates.map((candidate) => (
                        <div key={candidate.id}>
                            <span>{candidate.name}</span>
                            <button onClick={() => handleVote(candidate.id)}>Vote</button>
                        </div>
                    ))}
                </div>
            )}
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.user_id}>
                        {user.user_id}:
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="voter">Voter</option>
                            <option value="candidate">Candidate</option>
                            <option value="user">User</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;