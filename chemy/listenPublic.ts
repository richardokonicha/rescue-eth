import { Alchemy, Network, AlchemySubscription, Utils, Wallet } from 'alchemy-sdk';
import dotenv from 'dotenv';
dotenv.config();

const { API_KEY, PRIVATE_KEY } = process.env;

if (!API_KEY || !PRIVATE_KEY) {
    console.error("API_KEY or PRIVATE_KEY not found in .env file");
    process.exit(1);
}

const watchedAddress = '0xcf2e95ab5bcc1e2ac5f9f10340ca6fdd466e7a5f';
const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

const settings = {
    apiKey: API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);
const wallet = new Wallet(PRIVATE_KEY, alchemy);

async function forwardBalance(fromAddress: string, toAddress: string) {
    try {
        const balance = await alchemy.core.getBalance(fromAddress);
        const feeData = await alchemy.core.getFeeData();

        const pending = await alchemy.core.getTransactionCount(wallet.address, 'pending')

        console.log(pending)
        
        if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
            throw new Error("Failed to fetch fee data");
        }

        const gasLimit = Utils.parseUnits("21000", "wei");
        const gasCost = gasLimit.mul(feeData.maxFeePerGas);
        // const maxPossibleGasCost = gasLimit.mul(feeData.maxFeePerGas).mul(2);
        const maxPossibleGasCost = Utils.parseUnits("8000", "gwei");

        console.log('Ether balance:', Utils.formatEther(balance));
        console.log('Gas cost:', Utils.formatEther(gasCost));
        if (balance.lte(maxPossibleGasCost)) {
            console.log("Balance too low to cover gas costs");
            return;
        }
        
        const minAmount = Utils.parseEther("0.001"); // 0.0001 ETH
        let amountToSend = balance.sub(maxPossibleGasCost.mul(10));

        if (amountToSend.lt(minAmount)) {
            console.log("Amount to send is too low, skipping transaction");
            return;
        }

        console.log('Ether balance $:', Number(Utils.formatEther(balance)) * 3276.83);
        console.log('Ether balance $:', Number(Utils.formatEther(balance)) * 3276.83);
        console.log('Amount to send $:', Number(Utils.formatEther(amountToSend)) * 3276.83);
        console.log('Estimated gas cost $:', Number(Utils.formatEther(gasCost)) * 3276.83);
        console.log('maxPriorityFeePerGas', Number(Utils.formatEther(feeData.maxPriorityFeePerGas)) * 3276.83);
        console.log('maxPossibleGasCost', Number(Utils.formatEther(maxPossibleGasCost)) * 3276.83);


        const transaction = {
            to: toAddress,
            value: amountToSend,
            gasLimit: gasLimit,
            maxFeePerGas: maxPossibleGasCost.mul(3),
            maxPriorityFeePerGas: maxPossibleGasCost.mul(2),
            nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
            type: 2,
            chainId: (await wallet.getChainId()),
        };

        console.log("Forwarding balance:", transaction);

        const signedTx = await wallet.signTransaction(transaction);
        const txResponse = await alchemy.transact.sendTransaction(signedTx);
        console.log(`Balance transfer transaction sent: ${txResponse.hash}`);

        const receipt = await txResponse.wait();
        console.log(`Balance transfer confirmed in block: ${receipt.blockNumber}`);
        console.log(`Forwarded amount: ${Utils.formatEther(amountToSend)} ETH`);
    } catch (error) {
        console.error("Error forwarding balance:", error);
    }
}

alchemy.ws.on(
    {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [
            {to: watchedAddress}
        ],
        includeRemoved: false,
        hashesOnly: false
    },
    async (tx) => {
        console.log("Mined transaction detected:", tx.transaction.hash);
        
        try {
            // Small delay to ensure balance is updated
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Forward the balance
            await forwardBalance(watchedAddress, recipientAddress);
        } catch (error) {
            console.error("Error processing transaction:", error);
        }
    }
);

console.log(`Watching for incoming transactions to ${watchedAddress}...`);