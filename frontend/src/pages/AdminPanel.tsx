import React, { useState } from "react";
import NFTMarketplace from "./NftMarketplace";

export default function AdminPanel() {
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [removeAddress, setRemoveAddress] = useState("");

  const handleAddToWhitelist = () => {
    console.log("Adding to whitelist:", whitelistAddress);
    setWhitelistAddress("");
  };

  const handleRemoveFromWhitelist = () => {
    console.log("Removing from whitelist:", removeAddress);
    setRemoveAddress("");
  };

  return (
    <div className="flex flex-col min-h-screen py-22">
        {/* Header */}
        <header className="from-purple-500 to-indigo-500 py-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-lg mt-2">Manage the whitelist and monitor platform statistics</p>
        </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow p-6">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-600 mb-2">Total NFTs Minted</h3>
            <p className="text-4xl font-bold text-gray-800">1,234</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-2">Total Whitelisted Users</h3>
            <p className="text-4xl font-bold text-gray-800">567</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Platform Revenue (ETH)</h3>
            <p className="text-4xl font-bold text-gray-800">89.45</p>
            </div>
        </div>

        {/* Whitelist Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add to Whitelist */}
            <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">Add to Whitelist</h2>
            <p className="text-gray-600 mb-4">
                Enter the wallet address of the user you want to whitelist.
            </p>
            <input
                type="text"
                value={whitelistAddress}
                onChange={(e) => setWhitelistAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
                onClick={handleAddToWhitelist}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-md shadow-md hover:from-green-600 hover:to-teal-600 transition"
            >
                Add Address
            </button>
            </div>

            {/* Remove from Whitelist */}
            <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Remove from Whitelist</h2>
            <p className="text-gray-600 mb-4">
                Enter the wallet address of the user you want to remove from the whitelist.
            </p>
            <input
                type="text"
                value={removeAddress}
                onChange={(e) => setRemoveAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
                onClick={handleRemoveFromWhitelist}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-md shadow-md hover:from-red-600 hover:to-pink-600 transition"
            >
                Remove Address
            </button>
            </div>
        </div>
        </div>


        <NFTMarketplace title={"Our Nft's Listed"} />
    </div>
  );
}