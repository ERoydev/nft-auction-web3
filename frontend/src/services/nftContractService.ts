import { provider, contract } from "../utils/contract";


export async function mintNFT(tokenMetadataURL: string) {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    try {
        const tx = await contractWithSigner.safeMint(tokenMetadataURL);
        // TODO: Find a way to extend the ethers.BaseContract to include the safeMint method or find better way
        await tx.wait();
        console.log("NFT minted successfully:", tx);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
}