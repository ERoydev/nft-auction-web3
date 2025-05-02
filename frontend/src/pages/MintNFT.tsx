import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import NFTContractABI from "../abi/NFT.json";
import { createCollection, getCollection, uploadMetadata } from "../services/IPFSService";

export default function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate a preview URL for the uploaded image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !image) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    try {
        setIsMinting(true);

        // Check if MetaMask is connected
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed. Please install it to mint NFTs.");
            return;
        }

        // Connect to the wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // create a collections
        getCollection();
        // const cid = await uploa÷dMetadata(name, description, image);


        alert("NFT minted successfully!");
    } catch (error) {
        console.error("Error minting NFT:", error);
        alert("Failed to mint NFT. Please try again.");
    } finally {
        setIsMinting(false);
    }

    // Simulate minting process
    console.log("Minting NFT with the following data:");
    console.log({ name, description, image });

    // Reset form
    setName("");
    setDescription("");
    setImage(null);
    setPreview(null);

    navigate("/"); // Redirect to home page after minting
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-6 sm:px-12 lg:px-24 py-36">
      {/* Left Section: Image */}
      <div className="lg:w-1/2 hover:cursor-pointer">
        <img
          src="https://preview.redd.it/dflp7uclewj81.png?auto=webp&s=3f5da3e1c3007b118389f663f326cbc430f50257"
          alt="Mint NFT Illustration"
          className="w-full h-auto rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Right Section: Form */}
      <div className="lg:w-1/2">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 mb-6 text-center lg:text-left">
          Mint Your NFT
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-full mt-1 block w-full border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              placeholder="Enter NFT name"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-4 rounded-2xl border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              placeholder="Enter NFT description"
              rows={4}
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-600 hover:file:bg-cyan-100"
            />
            {preview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Image Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:from-cyan-600 hover:to-blue-600 transition"
          >
            Mint NFT
          </button>
        </form>
      </div>
    </div>
  );
}