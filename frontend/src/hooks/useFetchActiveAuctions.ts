// useFetch.ts
import { useState, useEffect } from 'react';
import { fetchActiveAuctions } from '../services/AuctionService';
import { getTokenURLFromTokenId } from '../services/nftContractService';

interface ActiveAuctions {
    seller: string;
    startPrice: string;
    endTime: number;
    highestBid: string;
    auctionId: number;
    highestBidder: string;
    imageurl: string;
    nftName: string;
}


// TODO: This is not the best way to do this, but it works for now.
// We should consider using a more efficient way to fetch and store token metadata.
export function useFetchActiveAuctions() {
    const [loading, setLoading] = useState(true);
    const [auctions, setAuctions] = useState<ActiveAuctions[]>([]);

    const fetchAllAuctions = async () => {
        setLoading(true);

        const activeAuctions = await fetchActiveAuctions();

        for (let i = 0; i < activeAuctions.length; i++) {
            const tokenMetadata = await getTokenURLFromTokenId(activeAuctions[i].auctionId);
            try {
                const res = await fetch(tokenMetadata);
                if (!res.ok) {
                    console.error("Error fetching token URL:", res.statusText);
                    continue;
                }
                const tokenData = await res.json();
                activeAuctions[i].imageurl = tokenData.image;
                activeAuctions[i].nftName = tokenData.name;
            } catch (error) {
                console.error("Error fetching token metadata:", error);
            }
        }
        setAuctions(activeAuctions);
        setLoading(false);
    } 

    useEffect(() => {
        fetchAllAuctions();
    }, []);

    return {loading, auctions};
}
