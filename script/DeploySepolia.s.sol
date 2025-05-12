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
// ✅  [Success] Hash: 0xffe87bab6e9e2412caa820138408b37e3834a4ac661b28d1f93f400179c4a340
// Contract Address: 0x47eE21F4693E78721458b5B54069B634A32B0910
// Block: 8310560
// Paid: 0.000001789789915206 ETH (1778949 gas * 0.001006094 gwei)


// ##### sepolia
// ✅  [Success] Hash: 0x1924ca7da3a99a71d723b9f094effd2818ca048b556efc5669499261a8620ab4
// Contract Address: 0x203f62985434663F62CE1c581B2C020c2AAcf305
// Block: 8310560
// Paid: 0.000005420178498712 ETH (5387348 gas * 0.001006094 gwei)

// ✅ Sequence #1 on sepolia | Total Paid: 0.000007331579020074 ETH (7287171 gas * avg 0.001006094 gwei)
                                                                                                                                                                                                  
