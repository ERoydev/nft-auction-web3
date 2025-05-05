// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {RoleManager} from "./abstract-contracts/RoleManager.sol";
import {MerkleWhiteList} from "./abstract-contracts/MerkleWhiteList.sol";
/*
Core Logic:
    Stores:
        - Price
        - Whitelist root
        - Chainlink oracle address

    Implements:
        - mint()
        - whitelist checks
        - ETH payment logic
        - admin functions(set price, update whitelist, etc.)
*/

/// @title Nft Contract
/// @author E.Roydev
/// @notice Used to mint nfts
contract NFT is ERC721, ERC721Burnable, RoleManager, MerkleWhiteList  {

    /// @notice links a token's unique tokenId to its metadata URL stored on nft.storage service
    mapping(uint256 => string) private _tokenURIs;
    uint256 private _currentTokenId;

    event TokenMinted(address indexed user, uint256 tokenId);

    constructor() ERC721("MyToken", "MTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // contract creator is DEFAULT_ADMIN
    }

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "user not an admin");
        _;
    }

    modifier allowedRole(bytes32 role) {
        require(hasRole(role, msg.sender), "doesn't have specified role");
        _;
    }

    function getTokenURL(uint256 tokenId) public view returns (string memory) {
        require(tokenId <= _currentTokenId, "token doesn't exist.");
        return _tokenURIs[tokenId];
    }

    // ===============================================

    modifier onlyWhitelistManager() {
        require(hasRole(WHITELIST_MANAGER, msg.sender), "not a whitelist manager");
        _;
    }

    function setMerkleRoot(bytes32 newRoot) external override onlyWhitelistManager {
        merkleRoot = newRoot;
        emit MerkleRootUpdated(newRoot);
    }

    /// @notice User who mints his token is the msg.sender so he mints to himself
    function safeMint(string calldata tokenMetadataURL) public {
        uint256 tokenId = _currentTokenId;
        _tokenURIs[tokenId] = tokenMetadataURL;
        _currentTokenId ++;

        _safeMint(msg.sender, tokenId);
        emit TokenMinted(msg.sender, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}