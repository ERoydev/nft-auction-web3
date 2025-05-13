import React, { useEffect } from "react";
import { fetchActiveAuctions } from "../../services/AuctionService";
import { useFetchActiveAuctions } from "../../hooks/useFetchActiveAuctions";

export default function ActiveAuction() {
  const { loading, auctions } = useFetchActiveAuctions();

  
  console.log("Active Auctions:", auctions);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold mb-6">Active Auctions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {auctions.map((auction) => (
          <div
            key={auction.auctionId}
            className="rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300"
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
                {auction.endTime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}