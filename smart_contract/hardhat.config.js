require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/HPsn42PhbXKQJa4pthLHjpqOeV5ChKKG`,
      accounts: [`${process.env.PRIVATE_KEY}`], // Ensure PRIVATE_KEY is read correctly
    },
  },
};
