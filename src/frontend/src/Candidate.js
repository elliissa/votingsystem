import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { WalletContext } from './WalletContext';

const Candidate = () => {
    const { account } = useContext(WalletContext);
    const [isCandidate, setIsCandidate] = useState(false);
    const [voteCount, setVoteCount] = useState(0);

    useEffect(() => {
        console.log("Account ID:", account);
        if (account) {
            checkCandidateStatus();
            fetchVoteCount();
            const intervalId = setInterval(fetchVoteCount, 5000); // Fetch vote count every 5 seconds

            return () => clearInterval(intervalId); // Clean up the interval on component unmount
        }
    }, [account]);

    const checkCandidateStatus = async () => {
        try {
            console.log("Fetching candidates...");
            const response = await axios.get('http://localhost:5000/candidates');
            const candidateList = response.data.candidates;
            console.log("Candidates fetched:", candidateList);
            const candidate = candidateList.find((cand) => cand.user_id === account);
            if (candidate) {
                setIsCandidate(true);
            }
        } catch (error) {
            console.error("Error checking candidate status:", error);
        }
    };

    const fetchVoteCount = async () => {
        try {
            console.log("Fetching vote count for:", account);
            const response = await axios.get(`http://localhost:5000/votes/count/${account}`);
            setVoteCount(response.data.count);
            console.log("Vote count fetched:", response.data.count);
        } catch (error) {
            console.error("Error fetching vote count:", error);
        }
    };

    const addAsCandidate = async () => {
        console.log("Register as Candidate button clicked");
        try {
            const response = await axios.post('http://localhost:5000/candidates', { name: account, user_id: account });
            console.log("Candidate registered:", response.data);
            setIsCandidate(true);
        } catch (error) {
            console.error("Error adding as candidate:", error);
        }
    };

    return (
        <div>
            <h1>Candidate Dashboard</h1>
            {isCandidate ? (
                <div>
                    <p>You are registered as a candidate.</p>
                    <p>Total Votes: {voteCount}</p>
                </div>
            ) : (
                <button onClick={addAsCandidate}>Register as Candidate</button>
            )}
        </div>
    );
};

export default Candidate;
