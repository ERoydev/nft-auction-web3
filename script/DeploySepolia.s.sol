// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";
import {EnglishAuction} from  "../src/Auction.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        EnglishAuction auction = new EnglishAuction();
        NFT nft = new NFT();

        

        vm.stopBroadcast();
    }
}
