import { ethers } from "ethers";
import { ROLES } from "../pages/admin";
import { provider, nftContract } from "../utils/contract";
import { addToWhitelist, updateTheRoot } from "./WhitelistService";


export async function assignRole(role: string, userAddress: string, senderRole: string) {
    /*
        TODO: Have in mind that i use `Available Accounts` to get wallet address
        if i use private keys this function will not work because it expects address 
    */

    try {
        if (role == ROLES[0]) {
            console.log("Assigning Whitelist Manager role to:", userAddress);

            const signer = await provider.getSigner();
            const contractWithSigner = nftContract.connect(signer);
;

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
  
    try {
      const isAdmin = await nftContract.isAdmin(account);
      const isWhitelistManager = await nftContract.isWhitelistManager(account);
      const isSalesPriceManager = await nftContract.isSalesPriceManager(account);
      const isPaymentTokensConfigurator = await nftContract.isPaymentTokensConfigurator(account);
  
      return {
        isAdmin,
        isWhitelistManager,
        isSalesPriceManager,
        isPaymentTokensConfigurator,
      };
    } catch (error) {
      console.error('Error fetching roles:', error);
      return {
        isAdmin: false,
        isWhitelistManager: false,
        isSalesPriceManager: false,
        isPaymentTokensConfigurator: false,
      };
    }
  };
  