import React, { createContext, useState, useEffect } from 'react';
import { initNear } from './nearUtils';
import nearConfig from "./nearConfig";
import axios from 'axios';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [account, setAccount] = useState(null);
    const [role, setRole] = useState(null);

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

    const signOut = () => {
        wallet.signOut();
        setAccount(null);
        setRole(null);
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

    return (
        <WalletContext.Provider value={{ wallet, account, role, signIn, signOut }}>
            {children}
        </WalletContext.Provider>
    );
};
