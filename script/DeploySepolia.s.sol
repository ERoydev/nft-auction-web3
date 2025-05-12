// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";
import {EnglishAuction} from  "../src/Auction.sol";

/*
Deploy with the following command in terminal:
    - `forge script script/DeploySepolia.s.sol --rpc-url $SEPOLIA_RPC --private-key $PRIVATE_KEY --broadcast`
    - Make sure you have set SEPOLIA_RPC => https://sepolia.infura.io/v3/....from infura or alchemy code here 
    - And Private Key for example exported from your metamask => Account details
*/


contract Deploy is Script {
    // Admin address to be hashed into the Merkle Root
    address adminAddress = vm.envAddress("INITIAL_ADMIN_ADDRESS");  // Replace with your actual admin address

    function run() external {
        vm.startBroadcast();

        // Generate merkle Root for the admin address
        bytes32 merkleRoot = keccak256(abi.encodePacked(adminAddress));

        EnglishAuction auction = new EnglishAuction();
        NFT nft = new NFT();

        nft.defaultPriceSetup(); // set the default Sepolia addresses i have configured for the Chainlink Price Feed and UsdcToken

        nft.setMerkleRoot(merkleRoot);

        vm.stopBroadcast();
    }
}

// ##### sepolia
// ✅  [Success] Hash: 0xbb8410ae783c333088247f6251de5721844b730df86509a700834bc594b4a3f9
// Contract Address: 0x2E4b9Da4a9b665F5DEF338946DE08c0F91835882
// Block: 8309352
// Paid: 0.00000128589549516 ETH (1778949 gas * 0.00072284 gwei)

// ##### sepolia
// ✅  [Success] Hash: 0xefcb993c83819d134d53b8f18028dea05985422d6736905bf94599d7374c3ae8
// Contract Address: 0x74c908C222Cb0356A7877cA26D950b2581824675
// Block: 8309352
// Paid: 0.00000384505991636 ETH (5319379 gas * 0.00072284 gwei)