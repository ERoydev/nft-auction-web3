import { useNavigate } from "react-router-dom";
import { useError } from "../../../hooks/useError";
import { endAuction } from "../../../services/AuctionService";
import { formatUnixTimestamp } from "../../../utils/formatUnixTimestamp";


export default function AuctionModal({
    selectedAuction,
    closeModal,
    handlePlaceBid,
    currentAccount,
    BID_VALUE,
    isBiddable,
}: {
    selectedAuction: any;
    closeModal: () => void;
    currentAccount: string;
    BID_VALUE?: number;
    handlePlaceBid?: () => void;
    isBiddable: boolean;
}) {
    const { showError, errorMessage } = useError();
    const navigate = useNavigate();

    console.log("Selected Auction:", selectedAuction);
    const handleEndAuction = async () => {
        const endAuctionResult = await endAuction(selectedAuction.auctionId);

        if (!endAuctionResult) {
            showError("Auction already ended.");
            return;
        }

        navigate("/");
    }

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl relative">
            <button
                onClick={closeModal}
                className="hover:cursor-pointer hover:scale-125 absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
                ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedAuction.nftName}</h2>
            <img
                src={selectedAuction.imageurl}
                alt={selectedAuction.nftName}
                className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p>
                <strong>Seller:</strong> {selectedAuction.seller}
            </p>
            <p>
                <strong>Current Bid:</strong> {parseFloat(selectedAuction.highestBid).toFixed(6)} ETH
            </p>
            <p>
                <strong>Highest Bidder:</strong> {selectedAuction.highestBidder || "No bids yet"}
            </p>
            <p>
                <strong>Ends On:</strong> {formatUnixTimestamp(selectedAuction.endTime)}
            </p>
            {selectedAuction.seller.toLocaleLowerCase() === currentAccount && (
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={handleEndAuction}
                        className="hover:cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        End Auction
                    </button>
                </div>
            )}
            {isBiddable && (
                <div className="mt-4 flex justify-between">
                    {currentAccount !== selectedAuction.seller.toLocaleLowerCase() && (
                    <button
                        onClick={handlePlaceBid}
                        className="hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Increment Bid with {BID_VALUE} ETH
                    </button>

                    )}
                </div>
            )}
            {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
            </div>
        </div>
    );
}