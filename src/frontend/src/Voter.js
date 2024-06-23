import React, {useContext, useEffect, useState} from 'react';
import { WalletContext } from './WalletContext';
import './Voter.css';

const Voter = () => {
    const { position, joinQueue, advanceQueue, fetchCandidates, vote, candidates } = useContext(WalletContext);
    const [isQueueJoined, setIsQueueJoined] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const handleVote = async (candidateId) => {
        await vote(candidateId);
        await advanceQueue();
    };

    const handleJoinQueue = async () => {
        await joinQueue();
        setIsQueueJoined(true);
    };

    return (
        <div className="voter-container">
            <h1>Voter Dashboard</h1>
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

export default Voter;