// useFetch.ts
import { useState, useEffect } from 'react';
import TokenData from '../intefaces/TokenData';
import { getTokenURLFromTokenId } from '../services/nftContractService';


export function useFetchTokenUrls(nftIds: any) {
    const [loading, setLoading] = useState(true);

    const [tokensData, setTokensData] = useState<TokenData[]>([]);

    const fetchTokenURLs = async () => {
        setLoading(true);
        const allTokenData: TokenData[] = [];

        for(let i = 0;i < nftIds.length; i++){
          const tokenURL = await getTokenURLFromTokenId(nftIds[i]);
          
          const res = await fetch(tokenURL);
          if(!res.ok) {
            console.error("Error fetching token URL:", res.statusText);
            continue;
          }

          const tokenData: TokenData = await res.json();   
          tokenData.tokenId = i; 
          allTokenData.push(tokenData);
        }
        setTokensData(allTokenData);
        setLoading(false);
    } 

    useEffect(() => {
      if (nftIds.length > 0) {
        fetchTokenURLs();
      }
    }, [nftIds]);

    return {loading, tokensData};
}
