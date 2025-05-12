import { ethers } from 'ethers';
import contractABI from "../abi/NFT.json";


// Connect to Sepolia
const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_SEPOLIA_RPC); 

// Contract addresses
const nftContractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
const auctionContractAddress = import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS;


// Create contract instance
const nftContract = new ethers.Contract(nftContractAddress, contractABI, provider);


export { provider, nftContract };
