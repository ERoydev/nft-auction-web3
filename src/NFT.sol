// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {RoleManager} from "./abstract-contracts/RoleManager.sol";

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
contract NFT is ERC721, ERC721Burnable, RoleManager {
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

    // ===============================================


    // function safeMint(address to, uint256 tokenId) public allowedRole(MINTER_ROLE) {
    //     _safeMint(to, tokenId);
    // }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}