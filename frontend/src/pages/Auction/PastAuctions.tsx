import React from "react";

interface AuctionData {
  id: number;
  nftName: string;
  finalBid: number;
  endTime: string;
  image: string;
}

const mockPastAuctions: AuctionData[] = [
  {
    id: 1,
    nftName: "CryptoPunk #101",
    finalBid: 3.2,
    endTime: "2025-05-10T12:00:00Z",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    nftName: "Bored Ape #202",
    finalBid: 6.5,
    endTime: "2025-05-11T15:00:00Z",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    nftName: "ArtBlock #303",
    finalBid: 2.8,
    endTime: "2025-05-12T18:00:00Z",
    image: "https://via.placeholder.com/150",
  },
];

export default function PastAuctions() {
  const formatEndDate = (endTime: string) => {
    const date = new Date(endTime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold mb-6">Past Auctions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {mockPastAuctions.map((auction) => (
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
                Final Bid: <span className="font-bold">{auction.finalBid} ETH</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Ended On: {formatEndDate(auction.endTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}