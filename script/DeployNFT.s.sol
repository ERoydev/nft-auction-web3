// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";
import "forge-std/console.sol";

contract DeployNFT is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the NFT contract
        NFT nft = new NFT();

        vm.stopBroadcast();
    }
}