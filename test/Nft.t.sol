// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseNFTTest} from "./BaseNFTTest.t.sol";
import {ERC20Mock} from "../src/utils/ERC20Mock.sol";
import { NFT} from "../src/NFT.sol";
import "forge-std/console.sol";

contract NFTTest is BaseNFTTest {

    struct TokenInfo {
        uint256 priceInUSDC;
        address owner;
        string metadataURI;
    }

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

        // (uint256 priceInUSDC, address tokenOwner, string memory metadataURI) = nft.tokenInfo(_tokenId);

        assertEq(nft.ownerOf(_tokenId), owner);

        uint256[] memory oneToken = new uint256[](1);
        oneToken[0] = 0;
        assertEq(nft.tokensOfOwner(owner), oneToken);


        uint256 expectedEth = nft.getTokenPriceInEth(_tokenId);
        vm.deal(addr1, 1 ether);
        vm.prank(addr1);
        nft.purchaseNFT{value: expectedEth}(_tokenId, true, addr1Proof);
        
        uint256[] memory noTokens = new uint256[](0);
        assertEq(nft.tokensOfOwner(owner), noTokens);

        assertNotEq(nft.ownerOf(_tokenId), owner);
        assertEq(nft.ownerOf(_tokenId), addr1);
    }

    function testPurchaseWithUSDCSuccess() public {
        uint256 usdcAmount = 100;

        vm.prank(owner);
        nft.safeMint(TOKEN_METADATA_URI, ownerProof, usdcAmount); // Creates a token with id `0`
        uint256 _tokenId = 0;

        // Check that the owner actually have this token in his collection
        assertEq(nft.ownerOf(_tokenId), owner);
        uint256[] memory tokenReceived = new uint256[](1);
        tokenReceived[0] = 0;
        assertEq(nft.tokensOfOwner(owner), tokenReceived);

        vm.startPrank(addr1);
        // Mint USDC tokens for addr1
        ERC20Mock(nft.usdcToken()).mint(addr1, 150); 
        uint256 balanceOfAddr1 = ERC20Mock(nft.usdcToken()).balanceOf(addr1);
        assertEq(balanceOfAddr1, 150);

        // Approve NFT contract to spend addr1's USDC tokens
        bool approvalSucccess = ERC20Mock(nft.usdcToken()).approve(address(nft), 120);
        assertTrue(approvalSucccess);

        // Check the allowance after approval
        uint256 allowance = ERC20Mock(address(nft.usdcToken())).allowance(addr1, address(nft));
        assertEq(allowance, 120);

        nft.purchaseNFT(_tokenId, false, addr1Proof);

        assertEq(ERC20Mock(nft.usdcToken()).balanceOf(addr1), 50); // Remaind total in this token Account
        assertEq(ERC20Mock(address(nft.usdcToken())).allowance(addr1, address(nft)), 20); // Remained allowed to spend from nft contract
        
        assertEq(ERC20Mock(nft.usdcToken()).balanceOf(owner), 100); // Owner received amount in his token Account

        // Check that owner no more own this token
        uint256[] memory emptyTokenWallet = new uint256[](0);
        assertNotEq(nft.ownerOf(_tokenId), owner);
        assertEq(nft.tokensOfOwner(owner), emptyTokenWallet);

        // Check that addr1 is the owner of this NFT token
        assertEq(nft.ownerOf(_tokenId), addr1);
        uint256[] memory receivedToken = new uint256[](1);
        receivedToken[0] = 0;
        assertEq(nft.tokensOfOwner(addr1), receivedToken);

        vm.stopPrank();
    }
}