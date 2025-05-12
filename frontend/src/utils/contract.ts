import { ethers } from 'ethers';
import nftContractABI from "../abi/NFT.json";


// Contract addresses
const nftContractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
const auctionContractAddress = import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS;

// 1. Read-only provider
const jsonRpcProvider = new ethers.JsonRpcProvider(import.meta.env.VITE_SEPOLIA_RPC);

// 2. Contract with read-only provider
const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, jsonRpcProvider);

// 3. Wallet provider (for frontend)
const getBrowserProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error("MetaMask not found");
};

// 4. Signer connected contract (for write methods like mint)
const getNFtWriteContract = async () => {
    const provider = getBrowserProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(nftContractAddress, nftContractABI, signer);
}

export { jsonRpcProvider, nftContract, getBrowserProvider, getNFtWriteContract };
