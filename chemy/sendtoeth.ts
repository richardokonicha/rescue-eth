import { Alchemy, Network, Wallet, Utils } from 'alchemy-sdk';

// Replace with your Alchemy API key
const alchemyApiKey = 'your-alchemy-api-key';

// Replace with your private key
const senderPrivateKey = 'your-private-key';

// Replace with your recipient address
const recipientAddress = 'recipient-wallet-address';

// Configuring the Alchemy SDK
const settings = {
  apiKey: alchemyApiKey,
  network: Network.ETH_MAINNET, // or other networks like ROPSTEN, KOVAN, etc.
};

// Creating an Alchemy instance
const alchemy = new Alchemy(settings);

// Create a wallet instance
const wallet = new Wallet(senderPrivateKey);

// Function to send a public transaction
async function sendPublicTransaction(to: string, amountInEth: string) {
  const tx = {
    to: to,
    value: Utils.parseEther(amountInEth),
    gasPrice: Utils.parseUnits('20', 'gwei'),
    gasLimit: Utils.hexlify(21000),
    nonce: await alchemy.core.getTransactionCount(wallet.address, 'latest'),
  };

  try {
    // Sign and send the transaction
    const signedTx = await wallet.signTransaction(tx);
    const txResponse = await alchemy.core.sendTransaction(signedTx);
    console.log('Public Transaction hash:', txResponse.hash);
    
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    console.log('Public Transaction was mined in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error sending public transaction:', error);
  }
}

// Function to send a private transaction
async function sendPrivateTransaction(to: string, amountInEth: string) {
  const tx = {
    to: to,
    value: Utils.parseEther(amountInEth),
    gasPrice: Utils.parseUnits('20', 'gwei'),
    gasLimit: Utils.hexlify(21000),
    nonce: await alchemy.core.getTransactionCount(wallet.address, 'latest'),
  };

  try {
    // Send the transaction via Flashbots
    const signedTx = await wallet.signTransaction(tx);
    const txResponse = await alchemy.core.sendPrivateTransaction(signedTx, { maxBlockNumber: 'latest' });
    console.log('Private Transaction hash:', txResponse.hash);
    
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    console.log('Private Transaction was mined in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error sending private transaction:', error);
  }
}

// Example usage
const amountToSend = '0.1';

// Send a public transaction
sendPublicTransaction(recipientAddress, amountToSend);

// Send a private transaction
sendPrivateTransaction(recipientAddress, amountToSend);
