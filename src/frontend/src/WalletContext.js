import React, { createContext, useState, useEffect } from 'react';
import { initNear } from './nearUtils';
import nearConfig from "./nearConfig";
import axios from 'axios';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [account, setAccount] = useState(null);
    const [role, setRole] = useState(null);
    const [position, setPosition] = useState(null);
    const [candidates, setCandidates] = useState([]);



    useEffect(() => {
        async function init() {
            const { wallet } = await initNear();
            setWallet(wallet);
            if (wallet.isSignedIn()) {
                const accountId = wallet.getAccountId();
                setAccount(accountId);
                const response = await axios.get(`http://localhost:5000/auth/role/${accountId}`);
                console.log("response: ", await response);
                setRole(response.data.role);
            }
        }
        init();
    }, []);

    const signIn = () => {
        wallet.requestSignIn(nearConfig.contractName);
    };

    const signOut = async () => {
        if (account) {
            await advanceQueue();
        }
        wallet.signOut();
        setAccount(null);
        setRole(null);
        setPosition(null);
    };

    useEffect(() => {
        const fetchAccount = async () => {
            if (wallet && wallet.isSignedIn()) {
                const accountId = wallet.getAccountId();
                setAccount(accountId);

                const loginResponse = await axios.post('http://localhost:5000/auth/login', { user_id: accountId });

                const roleResponse = await axios.get(`http://localhost:5000/auth/role/${accountId}`);
                setRole(roleResponse.data.role);
            }
        };
        fetchAccount();
    }, [wallet]);

    const joinQueue = async () => {
        if (account) {
            try {
                const response = await axios.post('http://localhost:5000/queue/join', { user_id: account });
                setPosition(response.data.position);
            } catch (error) {
                console.error(error.response.data.error);
            }
        }
    };

    const getPosition = async () => {
        if (account) {
            const response = await axios.get(`http://localhost:5000/queue/position/${account}`);
            setPosition(response.data.position);
        }
    };

    const advanceQueue = async () => {
        if (account) {
            try {
                await axios.post('http://localhost:5000/queue/advance', { user_id: account });
                setPosition(null);
            } catch (error) {
                console.error(error.response.data.error);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (account) {
                getPosition();
            }
        }, 5000); // Check position every 5 seconds

        return () => clearInterval(interval);
    }, [account]);


    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:5000/candidates');
            setCandidates(response.data.candidates);
        } catch (error) {
            console.error('Failed to fetch candidates', error);
        }
    };

    const vote = async (candidate_id) => {
        if (account) {
            try {
                await axios.post('http://localhost:5000/vote', { user_id: account, candidate_id });
                alert('Vote submitted successfully');
            } catch (error) {
                console.error('Failed to vote', error);
            }
        }
    };


    return (
        <WalletContext.Provider value={{ wallet, account, role, position, candidates, signIn, signOut, joinQueue, advanceQueue, fetchCandidates, vote }}>
            {children}
        </WalletContext.Provider>
    );
};
