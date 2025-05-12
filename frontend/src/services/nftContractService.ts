import { getBrowserProvider, nftReadContract, getNFtWriteContract } from "../utils/contract";

export async function mintNFT(tokenMetadataURL: string, merkleProof: Uint8Array[], priceInUSDCx: number) {
    const contractWithSigner = await getNFtWriteContract();

    try {
        const tx = await contractWithSigner.safeMint(tokenMetadataURL, merkleProof, priceInUSDCx);
        await tx.wait();
        console.log("NFT minted successfully:", tx);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
}

export async function getNFTsByOwner(ownerAddress: string) {    
    // Get all token IDs
    // Fetch each tokenId to get his URL
    try {
        const tokenIds = await nftReadContract.tokensOfOwner(ownerAddress);

        // TODO: There could be a problem if tokenID is too large for JavaScript numbers when i convert them to number(token) array
        const tokenIdsArray = tokenIds.map((token: any) => Number(token));
        return tokenIdsArray;
    } catch (error) {
        console.error("Error fetching NFTs:", error);
    }
}

export async function getTokenURLFromTokenId(tokenId: number) {
    try {
        const tokenURL = await nftReadContract.getTokenURL(tokenId);
        return tokenURL;
    } catch (error) {
        console.error("Error fetching token URL:", error);
    }
}