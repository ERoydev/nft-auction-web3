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


interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundID,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}


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

    // ================================================ Price and Payment Tokens this requires me to deploy on a TESTNET
    address public priceFeed = 0x5F4eC3DF9cBd43714b98F28De5C6F1b6C6a1665d; // Rinkeby ETH/USD Feed
    address public usdcToken; // USDC Token contract

    // TODO: Finish the payment logic, you should deploy to Sepolia and test the payment logic
    function setPriceFeed(address _feed) external onlyRole(DEFAULT_ADMIN_ROLE) {
        priceFeed = _feed;
    }


    function getLatestETHPrice() public view returns (uint256) {
        (, int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price); // e.g., 3000 * 1e8
    }
    // ================================================ Price and Payment Tokens


    constructor() ERC721("MyToken", "MTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // contract creator is DEFAULT_ADMIN
    }

    // =============================================== Merkle Root Functions
    function setMerkleRoot(bytes32 newRoot) external OnlyAdminOrWhitelistedManager {
        MerkleWhiteList._setMerkleRoot(newRoot);
    }
    // =============================================== Merkle Root Functions

    // =============================================== TOKENS Functions

    /// @notice User who mints his token is the msg.sender so he mints to himself
    function safeMint(
            string calldata tokenMetadataURL, 
            bytes32[] calldata merkleProof,
            bool payWithETH, 
            bool isPaid 
        ) public isWhitelisted(merkleProof) {
        // TODO: I don't have good error handling when user is not Whitelisted to provide a good frontend response for this problem. Currently i give general error that something went wrong.
        uint256 tokenId = _currentTokenId;
        require(bytes(tokenMetadataURL).length > 0, "Invalid metadata URL");

        if (isPaid) {
            // Should be paid with USDC or ETH
        } else {
            // Just mint the token, no payment required
            _tokenURIs[tokenId] = tokenMetadataURL;
            _currentTokenId ++;

            _safeMint(msg.sender, tokenId);

            // token tracking logic
            _addTokenToOwnerEnumeration(msg.sender, tokenId);
            emit TokenMinted(msg.sender, tokenId);
        }

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


    // =============================================== TOKENS Functions

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}