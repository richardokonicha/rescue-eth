import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from 'dotenv';
dotenv.config();

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

if (!ALCHEMY_API_KEY || !PRIVATE_KEY ) {
  console.error("ALCHEMY_API_KEY or PRIVATE_KEY not found in .env file");
  process.exit(1);
}

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    // hardhat: { 
    //   forking: {
    //     url: "https://eth-mainnet.alchemyapi.io/v2/your-api-key",
    //     blockNumber: 12345678,
    //   },
    // },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    }
  },
};

export default config;
