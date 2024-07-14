import { Alchemy, Network } from 'alchemy-sdk';

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

if (!ALCHEMY_API_KEY || !PRIVATE_KEY ) {
    console.error("API_KEY or PRIVATE_KEY not found in .env file");
    process.exit(1);
}


// Configuring the Alchemy SDK
const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA, // You can choose other networks like ROPSTEN, KOVAN, etc.
};

// Creating an Alchemy instance
const alchemy = new Alchemy(settings);

// Function to handle pending transactions
const handlePendingTransaction = (tx: any) => {
  console.log('Pending transaction:', tx);
};

// Subscribe to pending transactions
alchemy.ws.on('pendingTransactions', handlePendingTransaction);

console.log('Listening for pending transactions...');
