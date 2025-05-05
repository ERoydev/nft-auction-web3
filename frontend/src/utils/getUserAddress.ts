import { ethers } from 'ethers';

export async function getUserAddress(): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  // Ask MetaMask for permission
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Create a provider
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Get signer (user's wallet)
  const signer = await provider.getSigner();

  // Get the address
  const address = await signer.getAddress();

  return address;
}
