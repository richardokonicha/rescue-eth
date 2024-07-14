import { Alchemy, Network, Wallet, Utils, AlchemySubscription } from 'alchemy-sdk';
import dotenv from 'dotenv';
dotenv.config();

const { API_KEY, PRIVATE_KEY } = process.env;

if (!API_KEY || !PRIVATE_KEY ) {
    console.error("API_KEY or PRIVATE_KEY not found in .env file");
    process.exit(1);
}

const recipientAddress = '0xCf2E95Ab5BCC1E2aC5f9f10340cA6fdd466E7A5F';

const settings = {
    apiKey: API_KEY,
    network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);
const wallet = new Wallet(PRIVATE_KEY, alchemy);

// alchemy.core.getBlockNumber().then(console.log);
// alchemy.transact.simulateExecution().then(console.log);

async function sendPrivate() {
    const feeData = await alchemy.core.getFeeData();
    if (!feeData.maxPriorityFeePerGas || !feeData.maxFeePerGas) {
        console.error("Error fetching fee data");
        return;
    }
    
    const chainid = await wallet.getChainId();

    const etherBalance = await alchemy.core.getBalance(recipientAddress)

    console.log('Ether balance:', Utils.formatEther(etherBalance));
    

    const transaction = {
        to: recipientAddress,
        value: Utils.parseEther("0.00072"),
        gasLimit: Utils.parseUnits("21000", "wei"),

        // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        // maxFeePerGas: feeData.maxFeePerGas, 
        // maxFeePerGas: Utils.parseUnits("6", "gwei"),
        maxFeePerGas: Utils.parseUnits("1.5", "gwei"),
        maxPriorityFeePerGas: Utils.parseUnits("1", "gwei"),

        nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
        // nonce: 13,
        type: 2,
        chainId: chainid,
    };

    console.log('Transaction:', transaction);

    await wallet.getAddress().then(console.log);

    const rawTransaction = await wallet.signTransaction(transaction);
    console.log(rawTransaction);
    // alchemy.transact.sendPrivateTransaction(rawTransaction).then(console.log);
    
    // alchemy.transact.sendTransaction(rawTransaction).then(console.log);
}

sendPrivate();
