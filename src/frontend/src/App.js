import React, { useContext, useEffect  } from 'react';
import {WalletContext, WalletProvider} from './WalletContext';
import { BrowserRouter as Router, Routes, Route, useNavigate  } from 'react-router-dom';
import './App.css';

import Admin from './Admin';
import Voter from './Voter';
import Candidate from './Candidate';
import User from './User';
import ProtectedRoute from './ProtectedRoute';

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
        <div className="app-container">
            <div className="top-menu">
                {account ? (
                    <>
                        <p className="account-info">{account}</p>
                        {role && <p className="role-info">Role: {role}</p>}
                        <p className="contact">Contact address: admin@gmail.com</p>
                        <button className="sign-out-btn" onClick={signOut}>Sign Out</button>
                    </>
                ) : (
                    <button className="sign-in-btn" onClick={signIn}>Sign In with NEAR Wallet</button>
                )}
            </div>
            <Routes>
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin/></ProtectedRoute>}/>
                <Route path="/voter" element={<ProtectedRoute roles={['voter']}><Voter/></ProtectedRoute>}/>
                <Route path="/candidate" element={<ProtectedRoute roles={['candidate']}><Candidate/></ProtectedRoute>}/>
                <Route path="/user" element={<ProtectedRoute roles={['user']}><User/></ProtectedRoute>}/>
                <Route path="/unauthorized" element={<Unauthorized/>}/>
            </Routes>
        </div>
    );
};

const Unauthorized = () => {
    return <h1>Unauthorized Access</h1>;
};

export default App;
