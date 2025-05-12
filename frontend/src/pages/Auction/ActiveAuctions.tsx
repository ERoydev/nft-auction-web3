import React, { useEffect } from "react";
import { fetchActiveAuctions } from "../../services/AuctionService";
import { useFetchActiveAuctions } from "../../hooks/useFetchActiveAuctions";

interface AuctionData {
  id: number;
  nftName: string;
  currentBid: number;
  endTime: string;
  image: string;
}

const mockAuctions: AuctionData[] = [
  {
    id: 1,
    nftName: "CryptoPunk #123",
    currentBid: 2.5,
    endTime: "2025-05-15T12:00:00Z",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    nftName: "Bored Ape #456",
    currentBid: 5.0,
    endTime: "2025-05-16T15:00:00Z",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    nftName: "ArtBlock #789",
    currentBid: 1.2,
    endTime: "2025-05-17T18:00:00Z",
    image: "https://via.placeholder.com/150",
  },
];

export default function ActiveAuction() {
  const { loading, auctions } = useFetchActiveAuctions();


  console.log("Active Auctions:", auctions);

  const formatTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const timeLeft = end - now;

    if (timeLeft <= 0) return "Auction ended";

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold mb-6">Active Auctions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {mockAuctions.map((auction) => (
          <div
            key={auction.id}
            className="rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <img
              src={auction.image}
              alt={auction.nftName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {auction.nftName}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Current Bid: <span className="font-bold">{auction.currentBid} ETH</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {formatTimeLeft(auction.endTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}