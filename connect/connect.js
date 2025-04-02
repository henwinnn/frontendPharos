import { ethers } from "ethers";
import StableSwapABI from "../abi/StableSwapABI.json" assert { type: "json" }; // Import ABI dari file JSON
import idrxABI from "../abi/idrxABI.json" assert { type: "json" }; // Import ABI dari file JSON
import usdcABI from "../abi/usdcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import eurcABI from "../abi/eurcABI.json" assert { type: "json" }; // Import ABI dari file JSON

// Konfigurasi Smart Contract
const CONTRACT_ADDRESS_STABLESWAP =
  "0x34ADFc585fd4cD8b7641Ab5F23Eec15431A822c7"; // Ganti dengan alamat smart contract
const CONTRACT_ADDRESS_IDRX = "0x3EC5Fcbd6AABa546Ee3E861bb6adA1D0074d6EA2"; // Ganti dengan alamat smart contract
const CONTRACT_ADDRESS_USDC = "0x83d9D53bB598b082A18B36D5F1612b7bDB9A4061"; // Ganti dengan alamat smart contract
const CONTRACT_ADDRESS_EURC = "0xAf374bE65c1983712DeD1A82869862F746F3fe11"; // Ganti dengan alamat smart contract


const tokenAddressMapping = {
  "0x3EC5Fcbd6AABa546Ee3E861bb6adA1D0074d6EA2":idrxABI.abi,
  "0x83d9D53bB598b082A18B36D5F1612b7bDB9A4061":usdcABI.abi,
  "0xAf374bE65c1983712DeD1A82869862F746F3fe11":eurcABI.abi,
}
async function connectWalletContract() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("Connected account:", await signer.getAddress());
    return signer;
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
}

// Function to get token balance
async function getTokenBalance(contractAddress, abi, walletAddress) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const balance = await contract.balanceOf(walletAddress);

    const decimals = await contract.decimals();

    const formattedBalance = ethers.formatUnits(balance, decimals);

    return formattedBalance;
  } catch (error) {
    console.error(
      `Error fetching balance for contract ${contractAddress}:`,
      error
    );
    return "0.0"; // Return "0.0" on error
  }
}

// Function to get balances for all tokens
async function getAllTokenBalances(walletAddress) {
  const balanceIDRX = await getTokenBalance(
    CONTRACT_ADDRESS_IDRX,
    idrxABI.abi,
    walletAddress
  );
  const balanceUSDC = await getTokenBalance(
    CONTRACT_ADDRESS_USDC,
    usdcABI.abi,
    walletAddress
  );
  const balanceEURC = await getTokenBalance(
    CONTRACT_ADDRESS_EURC,
    eurcABI.abi,
    walletAddress
  );

  return {
    IDRX: balanceIDRX,
    USDC: balanceUSDC,
    EURC: balanceEURC,
  };
}

// Example usage
async function checkBalances() {
  const signer = await connectWalletContract();
  if (!signer) return;
  const walletAddress = await signer.getAddress();
  const balances = await getAllTokenBalances(walletAddress);
  return balances;
}

async function swapStable(i, j, amount = null, minDy = "0.01") {
  const signer = await connectWalletContract(); // Connect wallet and get signer
  if (!signer) {
    console.error("Wallet not connected");
    return;
  }

  try {
    const walletAddress = await signer.getAddress();

    // If `amount` is not provided, fetch the balance of the `fromToken`
    if (!amount) {
      console.log("Fetching balance for token index:", i);

      // Get the token address for the `fromToken` index
      const tokenAddress = Object.keys(tokenAddressMapping)[i];
      const abi = getTokenABI(tokenAddress);
      if (!abi) {
        console.error(`ABI not found for token address: ${tokenAddress}`);
        return;
      }

      // Fetch the balance of the `fromToken`
      const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      amount = ethers.formatUnits(balance, decimals); // Convert balance to human-readable format

      console.log(`Using balance as amount: ${amount}`);
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS_STABLESWAP,
      StableSwapABI.abi,
      signer // Use the signer to send transactions
    );

    console.log("Token Index i:", i);
    console.log("Token Index j:", j);
    console.log("Amount (dx):", amount);
    console.log("Minimum Output (minDy):", minDy);

    // Convert amount and minDy to BigNumber format
    const parsedAmount = ethers.parseUnits(amount, 18); // Adjust decimals if needed
    const parsedMinDy = ethers.parseUnits(minDy, 18); // Adjust decimals if needed
    console.log("Parsed Amount (dx):", parsedAmount.toString());
    console.log("Parsed Minimum Output (minDy):", parsedMinDy.toString());

    // Call the swap function on the contract
    const tx = await contract.swap(i, j, parsedAmount, parsedMinDy, {
      gasLimit: 1000000, // Adjust as needed
    });
    console.log("Transaction sent:", tx);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);

    return receipt; // Return the transaction receipt
  } catch (error) {
    console.error("Error during token swap:", error);
    throw error; // Re-throw the error for further handling
  }
}


function getTokenABI(tokenAddress) {
  const abi = tokenAddressMapping[tokenAddress];
  if (!abi) {
    console.error(`ABI not found for token address: ${tokenAddress}`);
    return null;
  }
  return abi;
}
async function approveToken(tokenAddress, amount) {
  const signer = await connectWalletContract();
  if (!signer) {
    console.error("Wallet not connected");
    return;
  }

  try {
    // Retrieve the ABI dynamically
    const abi = getTokenABI(tokenAddress);
    if (!abi) {
      console.error(`Cannot approve: ABI not found for token address ${tokenAddress}`);
      return;
    }

    // Create a contract instance for the token
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    // Convert the amount to BigNumber format
    const parsedAmount = ethers.parseUnits(amount, 18); // Adjust decimals if needed
    console.log(`Approving ${CONTRACT_ADDRESS_STABLESWAP} to spend ${parsedAmount.toString()} of token ${tokenAddress}`);

    // Call the approve function
    const tx = await tokenContract.approve(CONTRACT_ADDRESS_STABLESWAP, parsedAmount);
    console.log("Approval transaction sent:", tx);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Approval successful:", receipt);

    return receipt; // Return the transaction receipt
  } catch (error) {
    console.error("Error during token approval:", error);
    throw error; // Re-throw the error for further handling
  }
}

async function handleSwap(fromToken, toToken, amount) {
  try {
    const receipt = await swapStable(fromToken, toToken, amount);
    console.log("Swap successful:", receipt);
  } catch (error) {
    console.error("Swap failed:", error);
  }
}

export { connectWalletContract, checkBalances, handleSwap , approveToken};
