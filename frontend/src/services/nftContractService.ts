import { provider, contract } from "../utils/contract";


export async function mintNFT(tokenMetadataURL: string, merkleProof: Uint8Array[]) {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    try {
        const tx = await contractWithSigner.safeMint(tokenMetadataURL, merkleProof);
        // TODO: Find a way to extend the ethers.BaseContract to include the safeMint method or find better way
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
        const tokenIds = await contract.tokensOfOwner(ownerAddress);

        // TODO: There could be a problem if tokenID is too large for JavaScript numbers when i convert them to number(token) array
        const tokenIdsArray = tokenIds.map((token: any) => Number(token));
        return tokenIdsArray;
    } catch (error) {
        console.error("Error fetching NFTs:", error);
    }
}

export async function getTokenURLFromTokenId(tokenId: number) {
    try {
        const tokenURL = await contract.getTokenURL(tokenId);
        return tokenURL;
    } catch (error) {
        console.error("Error fetching token URL:", error);
    }
}