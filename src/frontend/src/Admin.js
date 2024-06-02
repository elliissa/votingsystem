import React, {useContext} from 'react';
import { WalletContext } from './WalletContext';

const Admin = () => {
    const { position, joinQueue, advanceQueue } = useContext(WalletContext);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {position !== null && <p>Queue Position: {position}</p>}
            <button onClick={joinQueue}>Join Queue</button>
            {position === 1 && <button onClick={advanceQueue}>Vote</button>}
        </div>
    );
};

export default Admin;