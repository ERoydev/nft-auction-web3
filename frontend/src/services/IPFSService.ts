import axios from 'axios';


// "5c6e39e6-98c6-4752-8b8f-806567c6fbc1" => created collection ID
// This should be created only when the contract NFT is deployed inside the collection i will throw all minted Tokens
export async function createCollection() {
  const collectionData = {
    collectionName: 'My NFT Collection', // Set your collection name
    contractAddress: '0xYourContractAddress', // Your contract address (EVM)
    chainID: '1', // Ethereum mainnet (1), or use the appropriate chain ID
    network: 'Ethereum', // Blockchain network (e.g., 'Ethereum', 'Solana', etc.)
  };

  try {
    const response = await axios.post(
      'https://preserve.nft.storage/api/v1/collection/create_collection',
      collectionData,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_NFT_STORAGE_API_KEY}`,
        },
      }
    );

    console.log('Collection created successfully:', response.data);
    return response.data; // You should get back the `collectionID` here.
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
}

// This function retrieves the list of tokens in your collection
export async function getCollection() {
    const collectionID = import.meta.env.VITE_NFT_STORAGE_COLLECTION_ID;

    try {
        const response = await axios.get(
        `https://preserve.nft.storage/api/v1/collection/list_tokens?collectionID=${collectionID}`,
        {
            headers: {
            Authorization: `Bearer ${import.meta.env.VITE_NFT_STORAGE_API_KEY}`, // Use your NFT.Storage API Key
            },
        }
        );

        if (response.status === 200) {
        console.log('Collection Tokens:', response.data);
        return response.data; // This contains the list of tokens in your collection.
        } else {
        throw new Error('Failed to fetch collection details.');
        }
    } catch (error) {
        console.error('Error fetching collection:', error);
        throw error;
    }
}
