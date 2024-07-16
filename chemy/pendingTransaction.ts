import {
    Alchemy,
    Network,
    AlchemySubscription,
    Utils,
    Wallet,
  } from "alchemy-sdk";
  import dotenv from "dotenv";
  dotenv.config();
  
  const { API_KEY, PRIVATE_KEY } = process.env;
  
  if (!API_KEY || !PRIVATE_KEY) {
    console.error("API_KEY or PRIVATE_KEY not found in .env file");
    process.exit(1);
  }
  
  const watchedAddress = "0x1e823dC78Fe0810c94991fafE7B1AF29F05C34bE";
  const recipientAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
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
  
      const pending = await alchemy.core.getTransactionCount(
        wallet.address,
        "pending"
      );
  
      console.log(pending);
  
      if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
        throw new Error("Failed to fetch fee data");
      }
  
      const gasLimit = Utils.parseUnits("21000", "wei");
      const gasCost = Utils.parseUnits("0.5", "ether"); // Set gas cost to 0.5 ETH
  
      const amountToSend = Utils.parseEther("20");
      const maxPriorityFeePerGas = Utils.parseEther("1");
      const maxFeePerGas = Utils.parseEther("1");
  
      const transaction = {
        to: toAddress,
        value: amountToSend,
        gasLimit: gasLimit,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
        type: 2,
        chainId: await wallet.getChainId(),
      };
  
      console.log("Forwarding balance:", transaction);
  
      const signedTx = await wallet.signTransaction(transaction);
      const txResponse = await alchemy.transact.sendTransaction(signedTx);
      const txRespone = await alchemy.transact.sendPrivateTransaction(signedTx);

      console.log(`Balance transfer transaction sent: ${txResponse.hash}`);
  
      const receipt = await txResponse.wait();
      console.log(`Balance transfer confirmed in block: ${receipt.blockNumber}`);
      console.log(`Forwarded amount: ${Utils.formatEther(amountToSend)} ETH`);
    } catch (error) {
      console.log("Error forwarding balance:", error);
    }
  }
  
  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: [{ to: watchedAddress }],
      includeRemoved: false,
      hashesOnly: false,
    },
    async (tx) => {
      console.log("Mined transaction detected:", tx.transaction.hash);
  
      try {
        // Small delay to ensure balance is updated
        await new Promise((resolve) => setTimeout(resolve, 2000));
  
        // Forward the balance
        while (true) {
            try {
                await forwardBalance(watchedAddress, recipientAddress);
                continue;
            } catch (error) {
                console.log("Error processing transaction:", error);
            }
            }
      } catch (error) {
        console.error("Error processing transaction:", error);
      }
    }
  );
  
  console.log(`Watching for incoming transactions to ${watchedAddress}...`);
  