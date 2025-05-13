// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";
import "forge-std/console.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {MockV3Aggregator} from "./mocks/MockChainlinkAddress.sol";
import {EnglishAuction} from  "../src/Auction.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        address adminAddress = vm.envAddress("INITIAL_ADMIN_ADDRESS");  // Replace with your actual admin address

        // Deploy The Mock contract
        ERC20Mock erc20Mock = new ERC20Mock();

        // Deploy the Mock Chainlink Price Feed;
        MockV3Aggregator chainlinkPriceFeed = new MockV3Aggregator(8, 2000 * 10**8); // price of ETH in USD

        // Generate merkle Root for the admin address
        bytes32 merkleRoot = keccak256(abi.encodePacked(adminAddress));

        // Deploy the NFT contract
        NFT nft = new NFT();
        EnglishAuction auction = new EnglishAuction();

        nft.setMerkleRoot(merkleRoot); // Set admin in whitelist

        nft.updatePriceFeedAddress(address(chainlinkPriceFeed)); // To setup the deployed Chainlink Price Feed
        nft.updateUsdcTokenAddress(address(erc20Mock)); // setup usdToken mock

        console.log('Deployed NFT contract with an address: ', address(nft));
        console.log('Deployed Auction contract with an address: ', address(auction));

        vm.stopBroadcast();
    }
}