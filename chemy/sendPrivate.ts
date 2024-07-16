import { Alchemy, Network, Wallet, Utils } from 'alchemy-sdk';
import dotenv from 'dotenv';
dotenv.config();

const { API_KEY, PRIVATE_KEY } = process.env;

if (!API_KEY || !PRIVATE_KEY) {
    console.error("API_KEY or PRIVATE_KEY not found in .env file");
    process.exit(1);
}

const recipientAddress = '0xCf2E95Ab5BCC1E2aC5f9f10340cA6fdd466E7A5F';

const settings = {
    apiKey: API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);
const wallet = new Wallet(PRIVATE_KEY, alchemy);

async function sendPrivate() {
    try {
        // Fetch fee data
        const feeData = await alchemy.core.getFeeData();
        if (!feeData.maxPriorityFeePerGas || !feeData.maxFeePerGas) {
            throw new Error("Failed to fetch fee data");
        }

        // Get chain ID
        const chainId = await wallet.getChainId();

        // Get ether balance
        const etherBalance = await alchemy.core.getBalance(recipientAddress);
        console.log('Ether balance:', Utils.formatEther(etherBalance));
        console.log("maxPriorityFeePerGas (gwei):", Utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"));
        console.log("maxFeePerGas (gwei):", Utils.formatUnits(feeData.maxFeePerGas, "gwei"));


        // Get nonce
        const nonce = await alchemy.core.getTransactionCount(wallet.getAddress());
        

        const transaction = {
            to: recipientAddress,
            value: Utils.parseEther("0.00015"),
            gasLimit: Utils.parseUnits("21000", "wei"),
            // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            // maxFeePerGas: feeData.maxFeePerGas,
            
            maxFeePerGas: Utils.parseUnits("15", "gwei"),
            maxPriorityFeePerGas: Utils.parseUnits("10", "gwei"),
            nonce: 3,
            // nonce: 1,
            type: 2,
            chainId: chainId,
        };

        console.log('Transaction:', transaction);

        const senderAddress = await wallet.getAddress();
        console.log('Sender address:', senderAddress);

        // Check if sender has enough balance
        const senderBalance = await alchemy.core.getBalance(senderAddress);
        if (senderBalance.lt(transaction.value)) {
            throw new Error("Insufficient balance for transaction");
        }

        const rawTransaction = await wallet.signTransaction(transaction);
        console.log('Raw transaction:', rawTransaction);
        const maxBlockNumber = 0x2540BE400

        // const txResponse = await alchemy.transact.sendTransaction(rawTransaction);
        // using private transaction maybe extremely slow or extremely expensive
        

        // const bdule = await alchemy.transact.simulateExecutionBundle([rawTransaction], maxBlockNumber);
        // console.log('Bundle:', bdule);
        
        const txResponse = await alchemy.transact.sendPrivateTransaction(rawTransaction, maxBlockNumber, { fast: true });
        console.log('Transaction sent:', txResponse);

        // Wait for transaction confirmation
        // const receipt = await txResponse;
        console.log('Transaction confirmed in block:', txResponse);

    } catch (error) {
        console.error('Error in sendPrivate function:', error);
        if (error) {
            console.error('Error code:', error);
        }
    }
}

sendPrivate().catch(error => {
    console.error('Unhandled error in main execution:', error);
    process.exit(1);
});