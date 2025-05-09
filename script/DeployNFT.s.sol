// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";
import "forge-std/console.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {MockV3Aggregator} from "./mocks/MockChainlinkAddress.sol";

contract DeployNFT is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy The Mock contract
        ERC20Mock erc20Mock = new ERC20Mock();

        // Deploy the Mock Chainlink Price Feed;
        MockV3Aggregator chainlinkPriceFeed = new MockV3Aggregator(8, 0);

        // Deploy the NFT contract
        NFT nft = new NFT();

        nft.updatePriceFeedAddress(address(chainlinkPriceFeed)); // To setup the deployed Chainlink Price Feed
        nft.updateUsdcTokenAddress(address(erc20Mock)); // setup usdToken mock

        console.log('Deployed NFT contract with an address: ', address(nft));

        vm.stopBroadcast();
    }
}