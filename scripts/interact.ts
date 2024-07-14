import hre from "hardhat";
import { SimpleContract } from "../typechain-types/SimpleContract";

async function main() {
    try {
        // Get the contract factory
        const SimpleContractFactory = await hre.ethers.getContractFactory("SimpleContract");

        // Specify the deployed contract address
        const contractAddress = "0xDE3d34872642c12CA5F3b5737Dc75ad4F643e98f";

        // Attach to the deployed contract
        const contract = SimpleContractFactory.attach(contractAddress) as SimpleContract;

        // Set a new message
        const newMessage = "Soul train";
        const tx = await contract.setMessage(newMessage);
        
        // Wait for the transaction to be mined
        await tx.wait();

        // Get the updated message
        const updatedMessage = await contract.getMessage();
        console.log("Updated message:", updatedMessage);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// Execute the main function
main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
});
