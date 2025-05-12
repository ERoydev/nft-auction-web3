import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { contract } from "../../utils/contract"; // Import your contract instance
import { ethers } from 'ethers';
import { fetchRolesFromSmartContract } from '../../services/RolesService';
import { getNFTsByOwner } from '../../services/nftContractService';

/*
Keeps track of the current wallet address, connect, disconnect, and roles of the user:
  - Added functionality to fetch roles from the smart contract.
  - Added functionality to listen for account changes in MetaMask.
*/

// TODO: Need to find the most optimal way to fetch the roles from smart contract and store them in a way i dont make too many requests. Possile solution is to use backend memoization

interface WalletContextType {
  currentAccount: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => boolean;
  isAdmin: boolean;
  isWhitelistManager: boolean;
  isSalesPriceManager: boolean;
  isPaymentTokensConfigurator: boolean; 
  nftIds: number[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [nftIds, setNftIds] = useState([]); // State to store NFT IDs

  const [roles, setRoles] = useState({
    isAdmin: false,
    isWhitelistManager: false,
    isSalesPriceManager: false,
    isPaymentTokensConfigurator: false,
  });

  const setTokenIdsOwned = async () => {
    if (!currentAccount) {
      console.error('No account connected');
      return;
    }
    const tokenIds = await getNFTsByOwner(currentAccount);
    setNftIds(tokenIds); // Update state with fetched NFT IDs
  }


  // Connect to wallet (MetaMask)
  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await setCurrentAccount(accounts[0]);
        window.localStorage.setItem('walletConnected', accounts[0]); // Store account in localStorage

        // Fetch nftIds for the connected account
        setTokenIdsOwned();

      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = (): boolean => {
    setCurrentAccount(null);
    window.localStorage.removeItem('walletConnected');
    return true;
  };

  // Reconnect functionality: On component mount, try to reconnect if a wallet address is stored in localStorage
  useEffect(() => {
    const storedAccount = window.localStorage.getItem('walletConnected');
    if (storedAccount) {
      setCurrentAccount(storedAccount);
      fetchRoles(storedAccount); // Fetch roles if an account is stored
    }

    // Listen for MetaMask account changes
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]); // Update the account if it changes
          window.localStorage.setItem('walletConnected', accounts[0]); // Save the new account to localStorage
          fetchRoles(accounts[0]); // Fetch roles for the new account
        } else {
          setCurrentAccount(null); // If no accounts, set to null
          window.localStorage.removeItem('walletConnected'); // Remove from localStorage if no account is selected
        }
      };

      // Add the event listener for account changes
      if (window.ethereum?.on) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      }

      // Clean up listener on component unmount
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  // Fetch NFTs whenever currentAccount changes
  useEffect(() => {
    if (currentAccount) {
      setTokenIdsOwned(); 
    }
  }, [currentAccount]);

  // Fetch roles from smart contract whenever currentAccount changes
  const fetchRoles = async (account: string) => {
    if (account) {
      const roles = await fetchRolesFromSmartContract(account);
      setRoles(roles);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        currentAccount,
        connectWallet,
        disconnectWallet,
        isAdmin: roles.isAdmin,
        isWhitelistManager: roles.isWhitelistManager,
        isSalesPriceManager: roles.isSalesPriceManager,
        isPaymentTokensConfigurator: roles.isPaymentTokensConfigurator,
        nftIds: nftIds, // Provide the NFT IDs to the context
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use WalletContext
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
