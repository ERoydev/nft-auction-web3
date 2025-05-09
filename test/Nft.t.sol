// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseNFTTest} from "./BaseNFTTest.t.sol";
import {ERC20Mock} from "../src/utils/ERC20Mock.sol";
import { NFT} from "../src/NFT.sol";
import "forge-std/console.sol";

contract NFTTest is BaseNFTTest {
    
    function testDeployment() public view {
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), owner));
    }

    function testDefaultAdminRoleAssigned() public view {
        bytes32 DEFAULT_ADMIN_ROLE = 0x00; // Taken from built-in code of AccessControl Contract from openzeppelin
        assertTrue(nft.hasRole(DEFAULT_ADMIN_ROLE, owner));
    }

    function testNameAndSymbol() public view {
        assertEq(nft.name(), "MyToken");
        assertEq(nft.symbol(), "MTK");
    }

    function testSetMerkleRootWithoutSetUp() public {
        address _owner = address(0x1);

        // Deploy the NFT contract
        vm.startPrank(_owner);
        NFT _nft = new NFT();

        // Set the Merkle root
        _nft.setMerkleRoot(merkleRoot);
        vm.stopPrank();

        assertEq(_nft.merkleRoot(), merkleRoot);
    }

    function testMintingTokenInfoSetting() public {
        uint256 priceInUsdc = 100;

        vm.prank(addr1);
        nft.safeMint(TOKEN_METADATA_URI, addr1Proof, priceInUsdc);

        (uint256 price, address ownerOfToken, string memory metadata) = nft.tokenInfo(0);
        
        // Check tokenInfo sets
        assertEq(price, priceInUsdc);
        assertEq(ownerOfToken, addr1); 
        assertEq(metadata, TOKEN_METADATA_URI);
    }

    function testMintingTokensOfOwnerSetting() public {
        uint256 priceInUsdc = 100;

        vm.prank(addr1);
        nft.safeMint(TOKEN_METADATA_URI, addr1Proof, priceInUsdc);

        uint256[] memory expectedTokens = new uint256[](1);
        expectedTokens[0] = 0;
        assertEq(nft.tokensOfOwner(addr1), expectedTokens);

        vm.prank(addr1);
        nft.safeMint(TOKEN_METADATA_URI, addr1Proof, 24);

        uint256[] memory expectedTokens2 = new uint256[](2);
        expectedTokens2[0] = 0;
        expectedTokens2[1] = 1;
        assertEq(nft.tokensOfOwner(addr1), expectedTokens2);
    }
    
    function testMintingAddToTokenEnumeration() public {
        uint256[] memory emptyTokens = new uint256[](0);
        assertEq(nft.tokensOfOwner(addr1), emptyTokens);

        uint256 priceInUsdc = 100;
        vm.prank(addr1);
        nft.safeMint(TOKEN_METADATA_URI, addr1Proof, priceInUsdc);

        uint256[] memory oneToken = new uint256[](1);
        oneToken[0] = 0;
        assertEq(nft.tokensOfOwner(addr1), oneToken);
    }

    function testMintingTokenOwnership() public {
        uint256 priceInUsdc = 100;
        vm.prank(addr1);
        nft.safeMint(TOKEN_METADATA_URI, addr1Proof, priceInUsdc);

        assertEq(nft.ownerOf(0), addr1, "addr1 should be the owner of tokenId 0");

        uint256[] memory expectedTokens = new uint256[](1);
        expectedTokens[0] = 0;
        assertEq(nft.tokensOfOwner(addr1), expectedTokens, "addr1 should own tokenId 0");
    }

    function testMintingShouldRevertBecauseEmptyMetadataURI() public {
        uint256 priceInUsdc = 100;
        vm.prank(addr1);
        vm.expectRevert("Invalid metadata URL");
        nft.safeMint("", addr1Proof, priceInUsdc);
    }

    function testPurchaseWithETHSuccess() public {
        uint256 usdcAmount = 100;

        vm.prank(owner);
        nft.safeMint(TOKEN_METADATA_URI, ownerProof, usdcAmount); // Creates a token with id `0`
        uint256 _tokenId = 0;

        uint256 expectedEth = nft.getTokenPriceInEth(_tokenId);
        vm.deal(addr1, 1 ether);
        vm.prank(addr1);
        nft.purchaseNFT{value: expectedEth}(_tokenId, true, addr1Proof);
        
        // assertEq(nft.ownerOf(1), addr1);
    }
}