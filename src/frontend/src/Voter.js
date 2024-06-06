import React, {useContext, useEffect} from 'react';
import { WalletContext } from './WalletContext';

const Voter = () => {
    const { position, joinQueue, advanceQueue, fetchCandidates, vote, candidates } = useContext(WalletContext);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const handleVote = async (candidateId) => {
        await vote(candidateId);
        await advanceQueue();
    };

    return (
        <div>
            <h1>Voter Dashboard</h1>
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
        </div>
    );
};

export default Voter;