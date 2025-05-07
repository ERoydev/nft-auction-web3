import React, { useState } from "react";
import NFTMarketplace from "../NftMarketplace";
import { addToWhitelist, removeFromWhitelist } from "../../services/WhitelistService";
import { isAddress } from "web3-validator"; // validation address library
import { WHITELIST_MANAGER, SALES_PRICE_MANAGER, PAYMENT_TOKENS_CONFIGURATOR} from "./index.ts";
import { assignRole } from "../../services/RolesService.ts";
import { ROLES } from "./index.ts";
import StatisticsSection from "../../components/ui/StatisticsSection.tsx";
import SectionHeader from "../../components/ui/SectionHeader.tsx";

export default function AdminPanel() {
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [removeAddress, setRemoveAddress] = useState("");
  const [userAddress, setUserAddress] = useState(""); // Address of the user making the request
  const [role, setRole] = useState(WHITELIST_MANAGER); // Role to be assigned

  const handleAddToWhitelist = async () => {
    // TODO: Validate the address format for etherium but since i work with anvil address i skip the checks
    // if (isAddress(whitelistAddress) === false) {
    //   alert("Invalid wallet address. Please enter a valid Ethereum address.");
    //   return;
    // }

    try {
        const newRoot = await addToWhitelist(whitelistAddress); // Pass userAddress as sender
        setWhitelistAddress("");
        console.log("Added to whitelist:", newRoot);

        
    } catch (error) {
        console.error("Error adding to whitelist:", error);
    }
  };

  const handleRemoveFromWhitelist = async () => {
    try {
        const newRoot = await removeFromWhitelist(removeAddress); // Pass userAddress as sender
        setRemoveAddress("");
        console.log("Removed from whitelist: ", newRoot);
    } catch (error) {
        console.error("Error removing from whitelist: ", error);
    }
  };

  const handleAssignRole = async () => {
    if (!ROLES.includes(role)) {
        alert("Invalid role. Please select a valid role.");
    }
    assignRole(role, userAddress.trim());
  }

  return (
    <div className="flex flex-col min-h-screen py-22">
        {/* Header */}
        <SectionHeader 
            title="Admin Panel"
            description="Manage the whitelist and monitor platform statistics"
        />

        {/* Main Content */}
        <div className="flex-grow p-6">
        {/* Statistics Section */}
            <StatisticsSection />

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
                    className="hover:cursor-pointer w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-md shadow-md hover:from-green-600 hover:to-teal-600 transition"
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
                    className="hover:cursor-pointer w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-md shadow-md hover:from-red-600 hover:to-pink-600 transition"
                >
                    Remove Address
                </button>
            </div>

        </div>
            {/* Assign Roles */}
            <div className="bg-white shadow-lg rounded-lg p-6 mt-12 w-full">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Assign Roles</h2>
                <p className="text-gray-600 mb-4">
                    Assign roles to specific wallet addresses.
                </p>
                <input
                    type="text"
                    placeholder="Enter wallet address"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {ROLES.map((roleItem) => (
                        <option key={roleItem} value={roleItem}>
                            {roleItem}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAssignRole}
                    className="hover:cursor-pointer w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-md shadow-md hover:from-blue-600 hover:to-indigo-600 transition"
                >
                    Assign Role
                </button>
            </div>
        </div>


        <NFTMarketplace title={"Our Nft's Listed"} />
    </div>
  );
}