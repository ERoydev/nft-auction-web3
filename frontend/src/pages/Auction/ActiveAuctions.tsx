import { useState, useEffect } from "react";
import { useFetchActiveAuctions } from "../../hooks/useFetchActiveAuctions";
import { formatUnixTimestamp } from "../../utils/formatUnixTimestamp";
import { placeBidAuction } from "../../services/AuctionService";
import { useError } from "../../hooks/useError";

interface AuctionDetails {
  seller: string;
  startPrice: string;
  endTime: number;
  highestBid: string;
  auctionId: number;
  highestBidder: string;
  imageurl: string;
  nftName: string;
}

export default function ActiveAuction() {
  const { loading, auctions: fetchedAuctions, refetch } = useFetchActiveAuctions(); // Use the hook directly
  const [auctions, setAuctions] = useState<AuctionDetails[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<AuctionDetails | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); // State for success effect
  const { errorMessage, showError } = useError(); // Hook to manage error messages]
  const BID_VALUE = 1;

  useEffect(() => {
    setAuctions(fetchedAuctions); // Update auctions whenever fetchedAuctions changes
  }, [fetchedAuctions]);

  const handleAuctionClick = (auction: AuctionDetails) => {
    setSelectedAuction(auction); // Set the selected auction to display in the modal
  };

  const closeModal = () => {
    setSelectedAuction(null); // Close the modal
  };

  const handlePlaceBid = async () => {
    if (!selectedAuction) return;

    const newBid = parseFloat(selectedAuction.highestBid) + BID_VALUE;

    const bidResult = await placeBidAuction(selectedAuction.auctionId, newBid.toString());

    if (!bidResult) {
      showError("Failed to place bid. Please try again.");
      return;
    }

    setShowSuccess(true); // Show success effect
    setTimeout(() => setShowSuccess(false), 2000); // Hide success effect after 2 seconds
    setSelectedAuction(null);
    // ✅ Refetch auctions after placing a bid
    refetch(); // Trigger the hook to fetch the latest auctions
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold mb-6">Active Auctions</h1>
      {loading ? (
        <p>Loading auctions...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              onClick={() => handleAuctionClick(auction)}
              key={auction.auctionId}
              className="hover:cursor-pointer rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <img
                src={auction.imageurl}
                alt={auction.nftName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {auction.nftName}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Current Bid: <span className="font-bold">{auction.highestBid} ETH</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Ends On: {formatUnixTimestamp(auction.endTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedAuction.nftName}</h2>
            <img
              src={selectedAuction.imageurl}
              alt={selectedAuction.nftName}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p>
              <strong>Seller:</strong> {selectedAuction.seller}
            </p>
            <p>
              <strong>Current Bid:</strong> {parseFloat(selectedAuction.highestBid).toFixed(6)} ETH
            </p>
            <p>
              <strong>Highest Bidder:</strong> {selectedAuction.highestBidder || "No bids yet"}
            </p>
            <p>
              <strong>Ends On:</strong> {formatUnixTimestamp(selectedAuction.endTime)}
            </p>
            <div className="mt-4">
              <button
                onClick={handlePlaceBid}
                className="hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Increment Bid with {BID_VALUE} ETH
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* Success Effect */}
      {showSuccess && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-2xl font-bold">
            🎉 Bid Placed Successfully!
          </div>
        </div>
      )}
    </div>
  );
}