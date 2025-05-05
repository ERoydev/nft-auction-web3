import { ethers } from "ethers";
import { provider, contract } from "../utils/contract";


// class NFTContract {
//     private contract: ethers.Contract;

//     constructor(address: string, abi: any, signerOrProvider: ethers.Signer | ethers.Provider) {
//         this.contract = new ethers.Contract(address, abi, signerOrProvider);
//     }

//     async safeMint(tokenMetadataURL: string): Promise<any> {
//         // Implement your custom logic here
//         return this.contract.safeMint(tokenMetadataURL);
//     }
// }

export async function mintNFT(tokenMetadataURL: string) {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    try {
        const tx = await contractWithSigner.safeMint(tokenMetadataURL);
        await tx.wait();
        console.log("NFT minted successfully:", tx);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
}