import { connect, keyStores, WalletConnection } from 'near-api-js';
import nearConfig from './nearConfig';

export async function initNear() {
    const near = await connect({
        deps: {
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        },
        ...nearConfig,
    });

    const appKeyPrefix = 'test-app';
    const wallet = new WalletConnection(near, appKeyPrefix);
    return { near, wallet };
}
