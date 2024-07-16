import { Alchemy, Network, Utils } from 'alchemy-sdk';

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

 alchemy.core.getBalance("0xcf2e95ab5bcc1e2ac5f9f10340ca6fdd466e7a5f").then((balance) => {
  console.log('Balance:', Number(balance) * 3276.83);
  console.log('Ether balance $:', Number(Utils.formatEther(balance)) * 3276.83) ;
  console.log("Balance (gwei):", Number(Utils.formatUnits(balance, "gwei")) * 3276.83 );
 });

// // Function to handle pending transactions
// const handlePendingTransaction = (tx: any) => {
//   console.log('Pending transaction:', tx);
// };

// // Subscribe to pending transactions
// alchemy.ws.on('pendingTransactions', handlePendingTransaction);

// console.log('Listening for pending transactions...');

