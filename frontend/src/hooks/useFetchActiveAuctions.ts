// useFetch.ts
import { useState, useEffect } from 'react';
import { fetchActiveAuctions } from '../services/AuctionService';

interface ActiveAuctions {
    seller: string;
    startPrice: string;
    endTime: number;
}

export function useFetchActiveAuctions() {
    const [loading, setLoading] = useState(true);
    const [auctions, setAuctions] = useState<ActiveAuctions[]>([]);

    const fetchAllAuctions = async () => {
        setLoading(true);

        const activeAuctions = await fetchActiveAuctions();

        setAuctions(activeAuctions);
        setLoading(false);
    } 

    useEffect(() => {
        fetchAllAuctions();
    }, []);

    return {loading, auctions};
}
