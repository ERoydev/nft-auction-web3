import { getAuctionWriteContract } from "../utils/contract";
import { approveNFT } from "./nftContractService";


export async function createAuction(data: any) {
    await approveNFT(data.tokenId);

    const contractWithSigner = await getAuctionWriteContract();
    const _nftAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

    try {
        const tx = await contractWithSigner.createAuction(_nftAddress, data.tokenId, data.startingPrice, data.duration);
        await tx.wait();
        console.log("Auction created successfully:", tx);
    } catch (error) {
        console.error("Error creating auction:", error);
    }
}