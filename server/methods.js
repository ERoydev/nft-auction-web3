import { nftContract } from "./contract.js";

export async function getRolesForUser(userAddress) {
    try {

        const roles = await nftContract.getRoles(userAddress);
        return roles;
    } catch (error) {
        console.error("Error settings role:", error);
    }
}