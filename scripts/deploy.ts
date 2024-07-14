import hre from "hardhat";

async function main(){
    try {
        const SimpleContract = await hre.ethers.getContractFactory("SimpleContract");
        const contract = await SimpleContract.deploy();
        await contract.waitForDeployment();
        const address = await contract.getAddress();
        console.log("SimpleContract deployed to:", address);
    } catch (error) {
        console.error(error);
        process.exit(1);
        
    }
}
main();