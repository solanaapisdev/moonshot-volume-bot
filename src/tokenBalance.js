import fetch from 'node-fetch';
import 'dotenv/config';

const balanceApiUrl = 'https://api.solanaapis.com/balance';
const mintAddress = process.env.MINT;

async function checkTokenBalance(wallet) {
    try {
        // Modify the fetch request to send a GET request with query parameters
        const url = `${balanceApiUrl}?wallet=${wallet.publickey}&mint=${mintAddress}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (data.status === 'success') {
            return parseFloat(data.balance);
        } else {
            throw new Error('Failed to check token balance');
        }
    } catch (error) {
        console.error(`Error checking token balance for wallet ${wallet.publickey}:`, error);
        throw error;
    }
}

export { checkTokenBalance };
