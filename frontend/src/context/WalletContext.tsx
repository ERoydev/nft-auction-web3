import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { provider, contract} from "../utils/contract";
import { ethers } from 'ethers';


/*
Keeps track of the current wallet address, connect, disconnect, and roles of the user:
  - Added functionality to fetch roles from the smart contract.
  - Added functionality to listen for account changes in MetaMask.
*/


interface WalletContextType {
  currentAccount: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => boolean;
  isAdmin: boolean;
  isWhitelistManager: boolean;
  isSalesPriceManager: boolean;
  isPaymentTokensConfigurator: boolean; 
}


const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

const fetchRolesFromSmartContract = async (account: string) => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Metamask is not installed.');
  }
  
  try {
    const isAdmin = await contract.isAdmin(account);
    const isWhitelistManager = await contract.isWhitelistManager(account);
    const isSalesPriceManager = await contract.isSalesPriceManager(account);
    const isPaymentTokensConfigurator = await contract.isPaymentTokensConfigurator(account);
    
    return {
      isAdmin,
      isWhitelistManager,
      isSalesPriceManager,
      isPaymentTokensConfigurator
    };
  } catch (error) {
    // Handle error if the contract call fails
    console.error('Error fetching roles:', error);
    return {
      isAdmin: false,
      isWhitelistManager: false,
      isSalesPriceManager: false,
      isPaymentTokensConfigurator: false
    };
  }
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [roles, setRoles] = useState({
    isAdmin: false,
    isWhitelistManager: false,
    isSalesPriceManager: false,
    isPaymentTokensConfigurator: false,
  })
  
  // console.log('Contract:', roles); // Log the contract for debugging
  // console.log('Current Account:', currentAccount); // Log the current account for debugging

  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const disconnectWallet = (): boolean => {
    setCurrentAccount(null);
    window.localStorage.removeItem('walletConnected');
    return true;
  };

  // Listen for MetaMask account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]); // Update the account if it changes
        } else {
          setCurrentAccount(null); // If no accounts, set to null
        }
      };

      // Add the event listener for account changes
      window.ethereum.on && window.ethereum.on('accountsChanged', handleAccountsChanged);

      if (currentAccount) {
        fetchRoles();
      }

      // Clean up listener on component unmount
      return () => {
        if (window.ethereum?.removeListener) {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          }
        }
      };
    }
  }, [currentAccount]);

  // fetch roles whenever currentAccount changes
  const fetchRoles = async () => {
    if (currentAccount) {
      const roles = await fetchRolesFromSmartContract(currentAccount);
      setRoles(roles);
    }
  }

  return (
    <WalletContext.Provider 
    value={{
        currentAccount, 
        connectWallet, 
        disconnectWallet,
        isAdmin: roles.isAdmin,
        isWhitelistManager: roles.isWhitelistManager,
        isSalesPriceManager: roles.isSalesPriceManager,
        isPaymentTokensConfigurator: roles.isPaymentTokensConfigurator
      }}
    
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
