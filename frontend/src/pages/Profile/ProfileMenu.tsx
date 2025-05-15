import { useEffect, useState } from "react";
import { useWallet } from "../../context/Wallet/WalletContext";
import { fetchUserBidHistory } from "../../services/AuctionService";
import BidHistory from "../../components/reusable/BidHistory";
import DisplayNftList from "../../components/reusable/NFT/DisplayNftList";
import TokenData from "../../intefaces/TokenData";
import LargeBanner from "../../components/ui/LargeBanner";
import DisplayNftModal from "../../components/reusable/NFT/DisplayNftModal";

export default function ProfileMenu() {
  const { currentAccount, tokensData } = useWallet();
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [selectedNft, setSelectedNft] = useState<TokenData | null>(null);

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
        <DisplayNftList tokensData={tokensData} handleCardClick={handleCardClick}/>

        {/* Modal */} 
        {selectedNft && (
          <DisplayNftModal closeModal={closeModal} selectedNft={selectedNft}/>
        )}
     
        {/* Bid History Section */}
        <BidHistory loading={loadingBids} bidHistory={bidHistory} />
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