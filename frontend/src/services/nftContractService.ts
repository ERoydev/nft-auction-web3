import { formatEther, formatUnits, parseEther, parseUnits } from "ethers";
import { getBrowserProvider, nftReadContract, getNFtWriteContract, getUsdcWriteContract } from "../utils/contract";

export async function mintNFT(tokenMetadataURL: string, merkleProof: Uint8Array[], priceInUSDCx: number) {
    const contractWithSigner = await getNFtWriteContract();
    
    try {
        const tx = await contractWithSigner.safeMint(tokenMetadataURL, merkleProof, priceInUSDCx);
        await tx.wait();
        console.log("NFT minted successfully:", tx);
        return {}
    } catch (error) {
        console.error("Error minting NFT:", error);
        return { error: error };
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

export async function approveNFT(tokenId: number) {
    try {
        const contractWithSigner = await getNFtWriteContract();
        const _contractToApprove = import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS;

        const tx = await contractWithSigner.approve(_contractToApprove, tokenId);
        await tx.wait();
        console.log("NFT approved successfully:", tx);
    } catch (error) {
        console.log("Error approving NFT:", error);
    }
}

export async function purchaseNFT(tokenId: number, payWithETH: boolean, merkleProof: Uint8Array[], priceInUsdc: string) {
    try {
        const contractWithSigner = await getNFtWriteContract();

        let tx;
        if (payWithETH) {
            // If paying with ETH, convert the price to Wei, 
            const ethPriceInWei = await contractWithSigner.getETHPriceForUSDCAmount(Number(priceInUsdc));

            tx = await contractWithSigner.purchaseNFT(tokenId, payWithETH, merkleProof, { value: ethPriceInWei });
        } else {
            // If paying with USDC, no need to include msg.value
            // if paying with USDC i need to approve the contract to spend USDC
            const usdcContractWithSigner = await getUsdcWriteContract();
            usdcContractWithSigner.approve(import.meta.env.VITE_NFT_CONTRACT_ADDRESS, priceInUsdc);

            tx = await contractWithSigner.purchaseNFT(tokenId, payWithETH, merkleProof);
        }

        await tx.wait();
        console.log("NFT purchased successfully:", tx);
        return true;
    } catch (error) {
        console.error("Error purchasing NFT:", error);
        return false;
    }
}

export async function getNFTPriceInEth(priceInUsdc: string) {
    try {
        const contractWithSigner = await getNFtWriteContract();
        const ethPriceInWei = await contractWithSigner.getETHPriceForUSDCAmount(Number(priceInUsdc));
        const ethPriceInEth = formatUnits(ethPriceInWei, 18); // to convert to ETH
        return ethPriceInEth;
    } catch (error) {
        console.error("Error fetching NFT price in ETH:", error);
    }
}