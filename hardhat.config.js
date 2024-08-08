require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
const { vars } = require("hardhat/config");

const ALCHEMY_API_KEY = vars.get('ALCHEMY_API_KEY');
const DEPLOYER_PRIVATE_KEY = vars.get('DEPLOYER_PRIVATE_KEY');
const ETHERSCAN_API_KEY = vars.get('ETHERSCAN_API_KEY');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`,
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api"
        }
      }
    ]
  },
  verify: {
    etherscan: {
      apiKey: `${ETHERSCAN_API_KEY}`  
    }
  },
  sourcify: {
    enabled: false,
  }
};
