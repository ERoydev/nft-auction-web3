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
// ✅  [Success] Hash: 0x34b5ad2e068f07699c5fe4c23c4f824d32cbff9e1f6024178c3035620c8e89aa
// Contract Address: 0x85A3986355b5328E5854b2664844C74c7C328DED
// Block: 8309631
// Paid: 0.000006234341465212 ETH (5387348 gas * 0.001157219 gwei)


// ##### sepolia
// ✅  [Success] Hash: 0x460fa2a21390e138e41e9f87dd070d0d5a45f57138cda6ccb9bd59fcb2cd3158
// Contract Address: 0xe0A8e0d0aDADaB4f574333Ea557EE86A5a38141C
// Block: 8309631
// Paid: 0.000002058633582831 ETH (1778949 gas * 0.001157219 gwei)