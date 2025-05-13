import React, { useState, useEffect } from "react";
import { fetchNonActiveAuctions } from "../../services/AuctionService";

interface AuctionData {
  auctionId: number;
  nftName: string;
  highestBid: string;
  endTime: number;
  imageurl: string;
}

export default function PastAuctions() {
  const [pastAuctions, setPastAuctions] = useState<AuctionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPastAuctions = async () => {
      setLoading(true);
      const auctions = await fetchNonActiveAuctions(); // Fetch non-active auctions
      setPastAuctions(auctions);
      setLoading(false);
    };

    loadPastAuctions();
  }, []);

  console.log(pastAuctions)

  const formatEndDate = (endTime: number) => {
    const date = new Date(endTime * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <p>Loading past auctions...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold mb-6">Past Auctions</h1>
      {pastAuctions.length === 0 ? (
        <p>No past auctions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {pastAuctions.map((auction) => (
            <div
              key={auction.auctionId}
              className="rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <img
                src={auction.imageurl || "https://via.placeholder.com/150"} // Use placeholder if imageurl is empty
                alt={auction.nftName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {auction.nftName || "Unnamed NFT"}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Final Bid: <span className="font-bold">{auction.highestBid} ETH</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Ended On: {formatEndDate(auction.endTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}