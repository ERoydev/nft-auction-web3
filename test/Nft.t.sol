// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseNFTTest} from "./BaseNFTTest.t.sol";
import {ERC20Mock} from "../src/utils/ERC20Mock.sol";
import { NFT} from "../src/NFT.sol";

contract NFTTest is BaseNFTTest {
    
    function testDeployment() public view {
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), owner));
    }

    function testInitialization() public view {
        
        
    }

    function testSetMerkleRootWithoutSetUp() public {
        address _owner = address(0x1);

         // Deploy mock USDC token
        ERC20Mock _usdcToken = new ERC20Mock();

        // Deploy the NFT contract
        vm.startPrank(_owner);
        NFT _nft = new NFT(address(_usdcToken));

        // Set the Merkle root
        _nft.setMerkleRoot(merkleRoot);
        vm.stopPrank();

        assertEq(_nft.merkleRoot(), merkleRoot);
    }

    function testMinting() public {
        uint256 priceInUsdc = 100;

        vm.prank(addr1);
        nft.safeMint(TOKEN_METADATA_URI, addr1Proof, priceInUsdc);

        (uint256 price, address ownerOfToken, string memory metadata) = nft.tokenInfo(0);
        
        assertEq(price, priceInUsdc);
        assertEq(ownerOfToken, addr1); 
        assertEq(metadata, TOKEN_METADATA_URI);
    }
}