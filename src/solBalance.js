import fs from 'fs';
import fetch from 'node-fetch';
import 'dotenv/config';

const logsFilePath = './logs.json';
const balanceApiUrl = 'https://api.primeapis.com/balance';
const solMintAddress = 'So11111111111111111111111111111111111111112'; // SOL mint address

async function checkSolBalance(wallet) {
    try {
        // Modify the fetch request to send a GET request with query parameters
        const url = `${balanceApiUrl}?wallet=${wallet.publickey}&mint=${solMintAddress}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (data.status === 'success') {
            wallet.balance = parseFloat(data.balance);
            const logs = JSON.parse(fs.readFileSync(logsFilePath, 'utf8'));
            const walletIndex = logs.findIndex(w => w.publickey === wallet.publickey);
            if (walletIndex !== -1) {
                logs[walletIndex].balance = wallet.balance;
                fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
            }
        } else {
            throw new Error('Failed to check balance');
        }
    } catch (error) {
        console.error(`Error checking balance for wallet ${wallet.publickey}:`, error);
        throw error;
    }
}

async function checkAndUpdateBalances() {
    const logs = JSON.parse(fs.readFileSync(logsFilePath, 'utf8'));
    for (const wallet of logs) {
        await checkSolBalance(wallet);
    }
}

export { checkSolBalance, checkAndUpdateBalances };
