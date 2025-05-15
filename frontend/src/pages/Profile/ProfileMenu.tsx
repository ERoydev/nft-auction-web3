import { useEffect, useState } from "react";
import { useWallet } from "../../context/Wallet/WalletContext";
import { fetchUserBidHistory } from "../../services/AuctionService";
import BidHistory from "../../components/reusable/BidHistory";
import DisplayNftList from "../../components/reusable/NFT/DisplayNftList";
import TokenData from "../../intefaces/TokenData";
import LargeBanner from "../../components/ui/LargeBanner";
import DisplayNftModal from "../../components/reusable/NFT/DisplayNftModal";
import { getLockedFunds, withdrawFunds } from "../../services/nftContractService";
import DisplayNftItem from "../../components/reusable/NFT/DisplayNftItem";
import emptyNft from "../../intefaces/EmptyNft";
import { useError } from "../../hooks/useError";

export default function ProfileMenu() {
  const { currentAccount, tokensData } = useWallet();
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [selectedNft, setSelectedNft] = useState<TokenData | null>(null);
  const [lockedFunds, setLockedFunds] = useState<number>(0);
  const { showError, errorMessage } = useError();

  const handleCardClick = (nft: TokenData) => { 
    setSelectedNft(nft);
  }

  const closeModal = () => {
    setSelectedNft(null);
  }

  useEffect(() => {
    const fetchBids = async () => {
      if (currentAccount) {
        setLoadingBids(true);
        const bids = await fetchUserBidHistory(currentAccount);
        setBidHistory(bids);
        setLoadingBids(false);
      }
    };

    fetchBids();
  }, [currentAccount]);

  useEffect(() => {
    const fetchLockedFunds = async () => {
      if (currentAccount) {
        const funds = await getLockedFunds(currentAccount);
        setLockedFunds(funds);
      }
    };

    fetchLockedFunds();
  }, [currentAccount]);

  const withdrawLockedFunds = async () => {
    if (currentAccount) {
      const withdrawResult = await withdrawFunds();

      if (withdrawResult.error) {
        showError(withdrawResult.error);
        return;
      }

      setLockedFunds(0);
    }
  }


  return (
    <div className="flex flex-col min-h-screen py-22">
      {/* Main Content */}
      <div className="flex-grow p-6 pb-22">
        <header className="from-cyan-500 to-blue-500 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to Your NFT Collection</h1>
            <p className="text-lg">Explore and manage your digital assets in one place.</p>
          </div>
        </header>

        <p className="text-center text-gray-600 mb-8">
          Below is a list of NFTs you own. Click on an NFT to view more details or manage it.
        </p>

        {/* NFT LIST SECTION */}
        {tokensData.length === 0 ? (
          <DisplayNftList tokensData={[emptyNft]} handleCardClick={(_nft: TokenData) => {}}/>
        ) : (
          <DisplayNftList tokensData={tokensData} handleCardClick={handleCardClick}/>
        )}
        
        {/* NFT List */}
        {/*
        <DisplayNftList tokensData={tokensData} handleCardClick={handleCardClick}/>

        {/* Modal */} 
        {selectedNft && (
          <DisplayNftModal closeModal={closeModal} selectedNft={selectedNft}/>
        )}
     
        {/* Bid History Section */}
        <BidHistory loading={loadingBids} bidHistory={bidHistory} />

        {/* Locked Funds */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Locked Funds</h2>
          <p className="text-gray-600">
            You have 
            <span className="font-bold text-indigo-600 mx-1">{Number(lockedFunds) / 1e18} ETH</span>
            locked in the NFT contract that you can withdraw.
          </p>
          <button
            onClick={withdrawLockedFunds} // Replace with actual withdraw logic
            className="hover:cursor-pointer mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition-colors"
          >
            Withdraw Funds
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>


      {/* Mint Suggestions banner */}
     <LargeBanner 
        title="Want to Mint More NFTs?"
        description="Create and add new NFTs to your collection with just a few clicks."
        link="/mintnft" 
        linkLabel="Mint New NFT"
     />

    </div>
  );
}