import React, { useState } from "react";
import { Link } from "react-router-dom";

interface NFT {
  id: string;
  image: string;
  title: string;
}

const mockedNFTs: NFT[] = [
  {
    id: "1",
    image: "https://via.placeholder.com/300",
    title: "Mock NFT #1",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/300",
    title: "Mock NFT #2",
  },
  {
    id: "3",
    image: "https://via.placeholder.com/300",
    title: "Mock NFT #3",
  },
];

export default function Auction() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleStartAuction = () => {
    if (!selectedNFT || !startingPrice || !duration) {
      alert("Please fill out all fields to start the auction.");
      return;
    }

    console.log("Starting auction for:", selectedNFT);
    console.log("Starting Price:", startingPrice, "ETH");
    console.log("Duration:", duration, "hours");

    // Reset form
    setSelectedNFT(null);
    setStartingPrice("");
    setDuration("");
    alert(`Auction started for ${selectedNFT.title}!`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen my-22 py-12 bg-gray-500/20 rounded-2xl">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Auction Menu</h2>
        <nav className="space-y-4">
          <Link
            to="/auction/start"
            className="flex items-center gap-3 text-lg font-semibold text-gray-900 hover:bg-gray-200 rounded-lg p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="w-5 h-5 text-cyan-500"
            >
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
            Start an Auction
          </Link>
          <Link
            to="/auction/active"
            className="flex items-center gap-3 text-lg font-semibold text-gray-900 hover:bg-gray-200 rounded-lg p-3"
          >
         <svg className="w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>
            Active Auctions
          </Link>
          <Link
            to="/auction/past"
            className="flex items-center gap-3 text-lg font-semibold text-gray-900 hover:bg-gray-200 rounded-lg p-3"
          >
            <svg className="w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
            Past Auctions
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Start an Auction</h1>
          <p className="text-lg mt-2 text-gray-600">
            Auction your NFTs and let the bidding begin!
          </p>
        </header>

        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Select NFT */}
          <div className="mb-6">
            <label htmlFor="nft" className="block text-sm font-medium text-gray-700 mb-2">
              Select NFT
            </label>
            <select
              id="nft"
              value={selectedNFT?.id || ""}
              onChange={(e) =>
                setSelectedNFT(mockedNFTs.find((nft) => nft.id === e.target.value) || null)
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select an NFT</option>
              {mockedNFTs.map((nft) => (
                <option key={nft.id} value={nft.id}>
                  {nft.title}
                </option>
              ))}
            </select>
            {selectedNFT && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
                <p className="text-gray-700 font-medium">{selectedNFT.title}</p>
              </div>
            )}
          </div>

          {/* Starting Price */}
          <div className="mb-6">
            <label
              htmlFor="startingPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Starting Price (ETH)
            </label>
            <input
              type="number"
              id="startingPrice"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="Enter starting price in ETH"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Auction Duration */}
          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Auction Duration (Hours)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration in hours"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Start Auction Button */}
          <button
            onClick={handleStartAuction}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-md shadow-md hover:from-cyan-600 hover:to-blue-600 transition"
          >
            Start Auction
          </button>
        </div>
      </div>
    </div>
  );
}