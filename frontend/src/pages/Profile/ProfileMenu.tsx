import { useWallet } from "../../context/Wallet/WalletContext";
import { Link } from "react-router-dom";
import Spinner from "../../components/reusable/Spinner";
import { useFetchTokenUrls } from "../../hooks/useFetchTokenUrls";


export default function ProfileMenu() {
  const { nftIds, currentAccount} = useWallet();
  const { loading, tokensData } = useFetchTokenUrls(currentAccount);

  return (
    <div className="flex flex-col min-h-screen py-22">
      {/* Main Content */}
      <div className="flex-grow p-6 pb-22">
        <header className=" from-cyan-500 to-blue-500 py-8">
            <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to Your NFT Collection</h1>
            <p className="text-lg">Explore and manage your digital assets in one place.</p>
            </div>
        </header>

        <p className="text-center text-gray-600 mb-8">
          Below is a list of NFTs you own. Click on an NFT to view more details or manage it.
        </p>

        {loading && <Spinner />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokensData.map((nft, idx) => (
          <div
          key={idx}
          className="border hover:cursor-pointer rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-2 hover:scale-105"
        >
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
          <p className="text-gray-600">{nft.description}</p>
        </div>
          ))}
        </div>

        
      </div>

      <div className="bg-gray-500/15 rounded-2xl py-8">

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Want to Mint More NFTs?</h3>
          <p className="text-gray-600 mb-4">
            Create and add new NFTs to your collection with just a few clicks.
          </p>
          <Link className="bg-gradient-to-r hover:cursor-pointer from-green-500 to-teal-500 text-white py-2 px-6 rounded-md shadow-md hover:from-green-600 hover:to-teal-600 transition" to="/mintnft">
            Mint New NFT
          </Link>
        </div>
        
      </div>

    </div>
  );
}