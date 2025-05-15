import { useState } from "react";
import { useFetchTokenUrls } from "../hooks/useFetchTokenUrls";
import Spinner from "../components/reusable/Spinner";
import { useWallet } from "../context/Wallet/WalletContext";
import { getMerkleProof } from "../services/WhitelistService";
import { purchaseNFT } from "../services/nftContractService";

interface TokenData {
  name: string;
  description: string;
  image: string;
  price: string;
  tokenId: number;
  priceInEth: number;
}

export default function NFTMarketplace({
  title
}: {
  title: string;
}) {
  const { currentAccount, refetch } = useWallet(); // Get the user's wallet address from context
  const { tokensData, loading, removeToken } = useFetchTokenUrls(import.meta.env.VITE_OWNER_OF_CONTRACTS); // Use the custom hook
  const [selectedNFT, setSelectedNFT] = useState<TokenData | null>(null); // State for selected NFT
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [playWithETH, setPlayWithETH] = useState(false); // State for "Play with ETH" option

  const handleCardClick = (nft: TokenData) => {
    setSelectedNFT(nft); // Set the selected NFT
    setIsModalOpen(true); // Open the modal
  };

  const handlePurchase = async () => {
    if (!selectedNFT) return;
    if (!currentAccount) {
      alert("Please connect your wallet to purchase an NFT.");
      return;
    }

    // Add your purchase logic here
    const merkleProof = await getMerkleProof(currentAccount);

    const purchaseResult = await purchaseNFT(selectedNFT.tokenId, playWithETH, merkleProof, selectedNFT.price);
    // Close the modal after purchase
    setIsModalOpen(false);
    removeToken(selectedNFT.tokenId); // Remove the purchased token from the list
    refetch(); // Refetch the userWallet data to update the changes.
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedNFT(null); // Clear the selected NFT
    setPlayWithETH(false); // Reset the "Play with ETH" option
  };
  

  return (
    <div className="py-32 px-6 sm:px-12 lg:px-24 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-purple-800/60 mb-12">
        {title}
      </h1>

      {loading ? ( // Show loading indicator while loading
        <Spinner />
      ) : tokensData.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No listed NFTs available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {tokensData.map((nft, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(nft)} // Handle card click
              className="rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 hover:cursor-pointer relative"
            >
              {/* Image */}
              <img
                src={nft.image}
                alt={`NFT ${nft.name}`}
                className="w-full h-48 object-cover"
              />

              {/* Overlay Text (NFT Name) */}
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs text-center py-1">
                {nft.name}
              </div>

              {/* NFT Details */}
              <div className="p-4">
                <p className="text-lg font-semibold text-gray-800">
                  Price: {nft.price} USDCx
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-2 border-t border-gray-500/[0.4] py-3">
                  {nft.description.slice(0, 40)}{/* Slice the description */}
                  {nft.description.length > 50 && "..."}{/* Add ellipsis if truncated */}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedNFT.name}</h2>
            <img
              src={selectedNFT.image}
              alt={selectedNFT.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-4">{selectedNFT.description}</p>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Price: {selectedNFT.price} USDCx
            </p>

            {/* Payment Operations */}
            {currentAccount !== import.meta.env.VITE_OWNER_OF_CONTRACTS.toLowerCase() && (
              <div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Pay with ETH:
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPlayWithETH(true)}
                      className={`px-4 py-2 rounded-lg ${
                        playWithETH
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setPlayWithETH(false)}
                      className={`px-4 py-2 rounded-lg ${
                        !playWithETH
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
  
                <button
                  onClick={handlePurchase}
                  className="hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Purchase
                </button>
              
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}