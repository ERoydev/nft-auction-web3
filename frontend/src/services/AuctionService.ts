import { getBrowserProvider, getAuctionWriteContract, auctionReadContract } from "../utils/contract";
import { approveNFT } from "./nftContractService";
import { ethers, parseEther } from "ethers";


export async function createAuction(data: any) {
    await approveNFT(data.tokenId);

    const contractWithSigner = await getAuctionWriteContract();
    const _nftAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

    // Convert ETH string to WEI
    const priceInWei = parseEther(data.startingPrice.toString());

    try {
        const tx = await contractWithSigner.createAuction(_nftAddress, data.tokenId, priceInWei, data.duration);
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

        // Fetch all "AuctionStarted" events
        const events = await auctionReadContract.queryFilter("AuctionStarted", 0, currentBlock);

        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds

        // Fetch the latest state of each auction
        const activeAuctions = await Promise.all(
            events.map(async (event: any) => {
                const { auctionId } = event.args;

                // Query the latest state of the auction from the contract
                const auctionData = await auctionReadContract.getAuction(auctionId);

                return {
                    seller: auctionData.seller,
                    auctionId: Number(auctionId),
                    startPrice: ethers.formatEther(auctionData.startPrice),
                    endTime: Number(auctionData.endTime),
                    highestBid: ethers.formatEther(auctionData.highestBid),
                    highestBidder: auctionData.highestBidder,
                    imageurl: "", // Placeholder for image URL
                    nftName: "", // Placeholder for NFT name
                };
            })
        );

        // Filter only active auctions
        return activeAuctions.filter((auction) => auction.endTime > now);
    } catch (error) {
        console.error("Error fetching auctions:", error);
        return [];
    }
}


export async function placeBidAuction(auctionId: number, bidAmount: string) {
    try {
        const contractWithSigner = await getAuctionWriteContract();
        // Convert ETH string to WEI
        const bidAmountInWei = parseEther(bidAmount);
        const tx = await contractWithSigner.placeBid(auctionId, { value: bidAmountInWei });
        await tx.wait();
        console.log("Bid placed successfully:", tx);
        return true;
    } catch (error) {
        console.error("Error placing bid:", error);
        return false;
    }
}