import { ethers } from "ethers";
import { ROLES } from "../pages/admin";
import { provider, contract } from "../utils/contract";
import { addToWhitelist } from "./WhitelistService";


export async function assignRole(role: string, userAddress: string) {
    /*
        TODO: Have in mind that i use `Available Accounts` to get wallet address
        if i use private keys this function will not work because it expects address 
    */

    try {
        if (role == ROLES[0]) {
            console.log("Assigning Whitelist Manager role to:", userAddress);

            const signer = await provider.getSigner();
            const contractWithSigner = contract.connect(signer);
;

            const result = await contractWithSigner.addWhitelistManager(userAddress);

            // This should be added to the whitelist
            addToWhitelist(userAddress);

            console.log("Whitelist Manager role assigned:", result);
        }
        
    } catch (error) {
        console.error("Error assigning role:", error);
        throw error
    }
}