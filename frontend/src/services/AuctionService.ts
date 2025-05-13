import { getBrowserProvider, getAuctionWriteContract, auctionReadContract } from "../utils/contract";
import { approveNFT } from "./nftContractService";
import { ethers } from "ethers";


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

export async function fetchActiveAuctions() {
    try {        
        const provider = getBrowserProvider();

        const currentBlock = await provider.getBlockNumber();
        
        // REMEMBER: When you query for events, make sure your `abi` is updated !!!
        // Fetch all "AuctionStarted" events
        const events = await auctionReadContract.queryFilter("AuctionStarted", 0, currentBlock);

        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        
        // Map and filter active auctions
        const activeAuctions = events
            .map((event) => {
                const { seller, auctionId, startPrice, endTime, highestBid, highestBidder } = (event as any).args;

                return {
                    seller,
                    auctionId: typeof auctionId === "bigint" ? Number(auctionId) : auctionId.toNumber(),
                    startPrice: ethers.formatEther(startPrice),
                    endTime: typeof endTime === "bigint" ? Number(endTime) : endTime.toNumber(),
                    highestBid: ethers.formatEther(highestBid),
                    highestBidder,
                    imageurl: "", // Placeholder for image URL
                    nftName: "", // Placeholder for NFT name
                };
            })
            .filter((auction) => auction.endTime > now); // Filter only active auctions

        return activeAuctions;
    } catch (error) {
        console.error("Error fetching auctions:", error);
        return [];
    }
}