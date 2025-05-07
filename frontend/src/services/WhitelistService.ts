import axios from "axios"
import { ethers } from "ethers";
import {arrayify} from "@ethersproject/bytes";
import { provider, contract} from "../utils/contract";


// Used only from admins to add/remove users from the whitelist

const SERVER_URL = "http://localhost:3000";


export async function getMerkleProof(userAddress: string) {
    try {
        const response = await axios.post(`${SERVER_URL}/getProof`, {
            address: userAddress,
        });
        
        // Its an array of hex strings
        
        const proofHex = response.data.proof;

        if (!Array.isArray(proofHex)) {
            throw new Error("Invalid Merkle proof response");
        }

        // Convert hex strings to bytes32 that smart contract expects
        const proofBytes32 = proofHex.map(p => arrayify(p));
        return proofBytes32;

    } catch (error) {
        console.error("Error fetching Merkle proof:", error);
        throw error;
    }
}

export async function addToWhitelist(walletAddress: string) {
    const wallet = walletAddress.trim();

    try {
        // Add whitelist to the json file on the server
        const response = await axios.post(`${SERVER_URL}/addAddress`, {
            address: wallet,
        });
        
        // Update the merkle root in the smart contract
        updateTheRoot();

        return response.data;
    } catch (error) {
        console.error("Error adding to whitelist:", error);
        throw error;
    }
}

export async function removeFromWhitelist(walletAddress: string) {
    const wallet = walletAddress.trim();

    try {
        // Remove whitelist from the json file on the server
        const response = await axios.post(`${SERVER_URL}/removeAddress`, {
            address: wallet,
        });

        // Update the merkle root in the smart contract
        updateTheRoot();

        return response.data;
    } catch (error) {
        console.error("Error removing from whitelist:", error);
        throw error;
    }
}


export async function updateTheRoot() {
    // TODO: Implement this function, but have in mind that only Whitelist Manager should be able to do this
    try {
        const response = await axios.get(`${SERVER_URL}/getMerkleRoot`);

        const newRoot = response.data.merkleRoot;

        const signer = await provider.getSigner();

        const contractWithSigner = contract.connect(signer);

        await contractWithSigner.setMerkleRoot(newRoot);

    } catch (error) {
        console.error("Error updating the root:", error);
        throw error;
    }
}