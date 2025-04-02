import { ethers } from "ethers";
import StableSwapABI from "../abi/StableSwapABI.json" assert { type: "json" }; // Import ABI dari file JSON
import idrxABI from "../abi/idrxABI.json" assert { type: "json" }; // Import ABI dari file JSON
import usdcABI from "../abi/usdcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import eurcABI from "../abi/eurcABI.json" assert { type: "json" }; // Import ABI dari file JSON

// Konfigurasi Smart Contract
const CONTRACT_ADDRESS_STABLESWAP = "0x34ADFc585fd4cD8b7641Ab5F23Eec15431A822c7"; // Ganti dengan alamat smart contract
const CONTRACT_ADDRESS_IDRX = "0x3EC5Fcbd6AABa546Ee3E861bb6adA1D0074d6EA2"; // Ganti dengan alamat smart contract
const CONTRACT_ADDRESS_USDC = "0x83d9D53bB598b082A18B36D5F1612b7bDB9A4061"; // Ganti dengan alamat smart contract
const CONTRACT_ADDRESS_EURC = "0xAf374bE65c1983712DeD1A82869862F746F3fe11"; // Ganti dengan alamat smart contract
const CONTRACT_ABI_STABLESWAP = [ StableSwapABI ]; // Ganti dengan ABI smart contract
const CONTRACT_ABI_IDRX = [ idrxABI ]; // Ganti dengan ABI smart contract
const CONTRACT_ABI_USDC = [ usdcABI ]; // Ganti dengan ABI smart contract
const CONTRACT_ABI_EURC = [ eurcABI ]; // Ganti dengan ABI smart contract


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

  async function getTokenBalanceIDRX(walletAddress) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS_IDRX, CONTRACT_ABI_IDRX, provider);
  
    try {
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      const formattedBalance = ethers.formatUnits(balance, decimals);
  
      console.log(`Balance of ${walletAddress}: ${formattedBalance} tokens`);
      return formattedBalance;
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  }

// async function connectContractStableSwap() {
//     if (!window.ethereum) {
//         alert("Metamask belum terinstal!");
//         return;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum); // Provider dari Metamask
//     const signer = await provider.getSigner(); // User yang connect ke dApp
//     const contract = new ethers.Contract(CONTRACT_ADDRESS_STABLESWAP, CONTRACT_ABI_STABLESWAP, signer);

//     return contract;
// }

// async function connectContractIDRX() {
//     if (!window.ethereum) {
//         alert("Metamask belum terinstal!");
//         return;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum); // Provider dari Metamask
//     const signer = await provider.getSigner(); // User yang connect ke dApp
//     const contract = new ethers.Contract(CONTRACT_ADDRESS_IDRX, CONTRACT_ABI_IDRX, signer);

//     return contract;
// }
// async function connectContractUSDC() {
//     if (!window.ethereum) {
//         alert("Metamask belum terinstal!");
//         return;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum); // Provider dari Metamask
//     const signer = await provider.getSigner(); // User yang connect ke dApp
//     const contract = new ethers.Contract(CONTRACT_ADDRESS_USDC, CONTRACT_ABI_USDC, signer);

//     return contract;
// }

// async function connectContractEURC() {
//     if (!window.ethereum) {
//         alert("Metamask belum terinstal!");
//         return;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum); // Provider dari Metamask
//     const signer = await provider.getSigner(); // User yang connect ke dApp
//     const contract = new ethers.Contract(CONTRACT_ADDRESS_EURC, CONTRACT_ABI_EURC, signer);

//     return contract;
// }

// Contoh penggunaan: Call function "getBalance" dari smart contract
// async function getBalance() {
//     const contract = await connectContract();
//     const balance = await contract.getBalance();
//     console.log("Balance:", balance.toString());
// }



export {connectWalletContract,getTokenBalanceIDRX };
