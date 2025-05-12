import { ethers } from 'ethers';
import contractABI from "../abi/NFT.json";


// Set up contract ABI and address
const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS; 

// Connect to Ethereum
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Local Anvil RPC URL

// Connect to Sepolia 

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);


export { provider, contract };
