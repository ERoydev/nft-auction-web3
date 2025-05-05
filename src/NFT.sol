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

    /// @dev links a token's unique tokenId to its metadata URL stored on nft.storage service
    mapping(uint256 => string) private _tokenURIs;
    uint256 private _currentTokenId;
    
    /// @dev track the tokens each address owns
    mapping(address => uint256[]) private _ownedTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex; // inside the array of tokens that address holds gives the index of the specific tokenId

    event TokenMinted(address indexed user, uint256 indexed tokenId);

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

    // =============================================== Merkle Root Functions

    modifier onlyWhitelistManager() {
        require(hasRole(WHITELIST_MANAGER, msg.sender), "not a whitelist manager");
        _;
    }

    modifier isWhitelisted(bytes32[] calldata merkleProof) {
        require(MerkleWhiteList.verifyProof(msg.sender, merkleProof), "this account is not whitelisted");
        _;
    }


    function setMerkleRoot(bytes32 newRoot) external onlyWhitelistManager {
        MerkleWhiteList._setMerkleRoot(newRoot);
    }

    // =============================================== Merkle Root Functions

    // =============================================== TOKENS

    /// @notice User who mints his token is the msg.sender so he mints to himself
    function safeMint(string calldata tokenMetadataURL, bytes32[] calldata merkleProof) public isWhitelisted(merkleProof) {
        // TODO: I don't have good error handling when user is not Whitelisted to provide a good frontend response for this problem. Currently i give general error that something went wrong.
        uint256 tokenId = _currentTokenId;
        require(bytes(tokenMetadataURL).length > 0, "Invalid metadata URL");

        _tokenURIs[tokenId] = tokenMetadataURL;
        _currentTokenId ++;

        _safeMint(msg.sender, tokenId);

        // token tracking logic
        _addTokenToOwnerEnumeration(msg.sender, tokenId);
        emit TokenMinted(msg.sender, tokenId);
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) internal {
        // TODO: If i need to handle transfers i should add _removeTokenFromEnumeration type of functionality
        uint256 length = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
        _ownedTokensIndex[tokenId] = length; 
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        // TODO: Maybe i should make checks that only owner of the tokens can retrieve this information
        return _ownedTokens[owner];
    }

    function getTokenURL(uint256 tokenId) public view returns (string memory) {
        require(tokenId <= _currentTokenId, "tokenId doesn't exist.");
        return _tokenURIs[tokenId];
    }


    // =============================================== TOKENS

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}