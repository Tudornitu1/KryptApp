const hre = require("hardhat");

const main = async () => {
  // Get the contract factory for Transactions
  const Transactions = await hre.ethers.getContractFactory("Transactions");

  // Deploy the contract
  const transactionsContract = await Transactions.deploy();

  // Wait for the contract deployment to complete
  await transactionsContract.waitForDeployment();

  // Log the contract address
  console.log("Transactions contract deployed to:", transactionsContract.target);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1); // Exit with error
  }
};

runMain();
