import { useEffect, useState } from "react";
import { getNFTsByOwner, getTokenURLFromTokenId } from "../services/nftContractService";
import Spinner from "../components/reusable/Spinner";

interface TokenData {
  name: string;
  description: string;
  image: string;
  price: string;
}

export default function NFTMarketplace({
  title
}: {
  title: string;
}) {
  const [tokensData, setTokensData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchTokenURLs = async () => {
    setLoading(true); // Start loading
    try {
      let nftIds = await getNFTsByOwner(import.meta.env.VITE_MARKETPLACE_NFT_OWNER);

      const allTokenData: TokenData[] = [];

      for (let i = 0; i < nftIds.length; i++) {
        const tokenURL = await getTokenURLFromTokenId(nftIds[i]);

        const res = await fetch(tokenURL);
        if (!res.ok) {
          console.error("Error fetching token URL:", res.statusText);
          continue;
        }

        const tokenData: TokenData = await res.json();
        allTokenData.push(tokenData);
      }
      setTokensData(allTokenData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchTokenURLs();
  }, []);

  return (
    <div className="py-32 px-6 sm:px-12 lg:px-24 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-purple-800/60 mb-12">
        {title}
      </h1>

      {loading ? ( // Show loading indicator while loading
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tokensData.map((nft, idx) => (
          <div
            key={idx}
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
    </div>
  );
}