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
        console.log("====trying here");
        const tokenIds = await contract.tokensOfOwner(ownerAddress);
        console.log("------TOKEN IDS", tokenIds);
    } catch (error) {
        console.error("Error fetching NFTs:", error);
    }


}