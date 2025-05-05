import axios from "axios"

// Used only from admins to add/remove users from the whitelist

const SERVER_URL = "http://localhost:3000";


export async function getMerkleProof(userAddress: string) {
    try {
        const response = await axios.post(`${SERVER_URL}/getProof`, {
            address: userAddress,
        });
    
        return response.data;
    } catch (error) {
        console.error("Error fetching Merkle proof:", error);
        throw error;
    }
}