import React, { useContext, useEffect  } from 'react';
import {WalletContext, WalletProvider} from './WalletContext';
import { BrowserRouter as Router, Routes, Route, useNavigate  } from 'react-router-dom';

import Admin from './Admin';
import Voter from './Voter';
import Candidate from './Candidate';
import User from './User';

const App = () => {
    return (
        <Router>
            <WalletProvider>
                <Main />
            </WalletProvider>
        </Router>
    );
};

const Main = () => {
    const { account, role, signIn, signOut } = useContext(WalletContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (role) {
            switch (role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'voter':
                    navigate('/voter');
                    break;
                case 'candidate':
                    navigate('/candidate');
                    break;
                case 'user':
                default:
                    navigate('/user');
                    break;
            }
        }
    }, [role, navigate]);

    return (
        <div>
            {account ? (
                <>
                    <p>{account}</p>
                    {role && <p>Role: {role}</p>}
                    <button onClick={signOut}>Sign Out</button>
                    <Routes>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/voter" element={<Voter />} />
                        <Route path="/candidate" element={<Candidate />} />
                        <Route path="/user" element={<User />} />
                    </Routes>
                </>
            ) : (
                <>
                    <button onClick={signIn}>Sign In with NEAR Wallet</button>
                </>
            )}
        </div>
    );
};

export default App;
