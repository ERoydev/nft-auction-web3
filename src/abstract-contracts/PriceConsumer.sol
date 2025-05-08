// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


/// @dev - Tested in Remix on Sepolia it works
abstract contract PriceConsumer {
    address public usdcToken; // USDC Token contract

    AggregatorV3Interface internal priceFeed; // PriceFeed contract here
    address public DEFAULT_CHAINLINK_SEPOLIA_ETH_USD_CONTRACT = 0x694AA1769357215DE4FAC081bf1f309aDC325306; 
    address public customChainlinkPriceFeedAddress; // allow PriceFeed to be updated

    event ChainlinkPriceFeedIsUpdated(address indexed updatedBy, address newPriceFeed);
    event DefaultChainlinkPriceFeed();

    // Function to get the latest ETH/USD price from the Chainlink feed
    function _getLatestPrice() internal view returns (int) {
        (
             , // Ignore roundID
            int price, 
            , // Ignore startedAt
            , // Ignore timeStamp
            // Ignore answeredInRound
        ) = priceFeed.latestRoundData();
        
        // Return the current price (in 8 decimal places)
        return price; // Will be USD price for 1 ETH, but scaled by 8 decimal places => for Precission to the last cent
        // Example 196727477529, it represents $1967.27 for 1 ETH.
        // 196727477529 / 100000000 = 1967.27....
    }

    function getETHPriceForUSDCAmount(uint256 _usdcAmount) public view returns (uint256) {
        int usdPriceForOneEth = _getLatestPrice(); 
        require(usdPriceForOneEth > 0, "Eth has collapsed, escape with your money and leave people crying :)");

        uint256 ethPriceInUsd = uint256(usdPriceForOneEth) / 1e8;// Descale it recieve 1967.21 price for example 

        // Ensure that the ETH price is not zero
        require(ethPriceInUsd > 0, "ETH price seems invalid");

        // I convert usdc to ETH to match the 18 decimals of eth price in USD
        uint256 ethAmountInWei = (_usdcAmount * 1e18) / ethPriceInUsd; // i will receive wei 7612900000000000000 WEI
        return ethAmountInWei;
    }

    function _updatePriceFeedAddress(address _newPriceFeedAddress) internal {
        require(_newPriceFeedAddress != address(priceFeed), "Price Feed address is the same");
        customChainlinkPriceFeedAddress = _newPriceFeedAddress;
        priceFeed = AggregatorV3Interface(_newPriceFeedAddress);

        emit ChainlinkPriceFeedIsUpdated(msg.sender, _newPriceFeedAddress);
    }

    function _default() internal {
        priceFeed = AggregatorV3Interface(DEFAULT_CHAINLINK_SEPOLIA_ETH_USD_CONTRACT);

        emit DefaultChainlinkPriceFeed();
    }
}
