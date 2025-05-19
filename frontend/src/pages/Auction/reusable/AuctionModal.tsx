import { useError } from "../../../hooks/useError";
import { endAuction } from "../../../services/AuctionService";
import DisplayNftModal from "../../../components/reusable/NFT/DisplayNftModal";
import { mapToDisplayableNft } from "../../../intefaces/DisplayableNft";


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

    const handleEndAuction = async () => {
        const endAuctionResult: any = await endAuction(selectedAuction.auctionId);

        if (endAuctionResult.error) {
            showError(endAuctionResult.error);
            return;
        } else {    
            closeModal();
        }
    }

    return(
        <DisplayNftModal 
            closeModal={closeModal} 
            selectedNft={mapToDisplayableNft(selectedAuction)}
            isBiddable={isBiddable}
            currentAccount={currentAccount}
            handleEndAuction={handleEndAuction}
            BID_VALUE={BID_VALUE}
            handlePlaceBid={handlePlaceBid}
            errorMessage={errorMessage}
        />
    );
}



