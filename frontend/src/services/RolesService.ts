import { ethers } from "ethers";
import { ROLES } from "../pages/admin";
import { getBrowserProvider, nftReadContract, getNFtWriteContract } from "../utils/contract";
import { addToWhitelist, updateTheRoot } from "./WhitelistService";
import axios from "axios";


export async function assignRole(role: string, userAddress: string, senderRole: string) {
    /*
        TODO: Have in mind that i use `Available Accounts` to get wallet address
        if i use private keys this function will not work because it expects address 
    */

    try {
        if (role == ROLES[0]) {
            console.log("Assigning Whitelist Manager role to:", userAddress);

            const contractWithSigner = await getNFtWriteContract();

            const result = await contractWithSigner.addWhitelistManager(userAddress);
        
            // This should be added to the whitelist
            addToWhitelist(userAddress, senderRole);

            // updateTheRoot();

            console.log("Whitelist Manager role assigned:", result);
        }
        
    } catch (error) {
        console.error("Error assigning role:", error);
        throw error
    }
}


export const fetchRolesFromSmartContract = async (account: string) => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Metamask is not installed.');
  } 

  console.log('ACCOUNT', account);

  try {
    // Send a POST request with the account address in the JSON body
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/roles/`, {
      address: account,  // send the address in the body of the request
    });

    const roles = response.data.roles;
    console.log('Roles for address', roles);

    // Returning the roles in the structured format
    return {
      isAdmin: roles.isAdmin,
      isWhitelistManager: roles.isWhitelistManager,
      isSalesPriceManager: roles.isSalesPriceManager,
      isPaymentTokensConfigurator: roles.isPaymentTokensConfigurator,
    };
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return default values if there's an error
    return {
      isAdmin: false,
      isWhitelistManager: false,
      isSalesPriceManager: false,
      isPaymentTokensConfigurator: false,
    };
  }
};
