// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseNFTTest} from "../BaseNFTTest.t.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MapWhitelist is BaseNFTTest, AccessControl {
    bytes32 public constant WHITELIST_MANAGER = keccak256("WHITELIST_MANAGER");

    mapping(address => bool) private whitelistedAddresses;

    event AddressAddedToWhitelist(address account);
    event AddressRemoveFromWhitelist(address account);

    modifier OnlyAdminOrWhitelistedManager() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(WHITELIST_MANAGER, msg.sender),
        "Not an admin or a whitelist manager"
        );
        _;
    }

    modifier onlyMapWhitelisted() {
        require(isMapWhitelisted(msg.sender), "Not whitelisted");
        _;
    }

    function isMapWhitelisted(address account) public view returns (bool) {
        return whitelistedAddresses[account];
    }

    function addToWhitelist(address account) public OnlyAdminOrWhitelistedManager {
        require(!isMapWhitelisted(account), "Address is already whitelisted");

        whitelistedAddresses[account] = true;
        emit AddressAddedToWhitelist(account);
    }

    function removeFromWhitelist(address account) public OnlyAdminOrWhitelistedManager {
        require(isMapWhitelisted(account), "Address is not whitelisted to be removed");

        whitelistedAddresses[account] = false;
        emit AddressRemoveFromWhitelist(account);
    }
}

contract MerkleWhiteListTest is MapWhitelist {

    uint256 public merkleRootTotalGasUsage;
    uint256 public mappingTotalGasUsage;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function testCombinedGasUsageComparison() public {
        uint256 merkleTotal;
        uint256 mappingTotal;

        // --- Merkle add ---
        bytes32 newRoot = keccak256(abi.encodePacked(addr1));
        vm.startPrank(owner);
        uint256 gasBefore = gasleft();
        nft.setMerkleRoot(newRoot);
        uint256 gasAfter = gasleft();
        merkleTotal = gasBefore - gasAfter;
        assertEq(nft.merkleRoot(), newRoot, "Merkle root should be updated.");
        vm.stopPrank();

        // --- Mapping add ---
        vm.startPrank(owner);
        gasBefore = gasleft();
        addToWhitelist(addr1);
        gasAfter = gasleft();
        mappingTotal += gasBefore - gasAfter;
        vm.stopPrank();

        // --- Merkle remove ---
        bytes32 newRoot2 = keccak256(abi.encodePacked(addr1, addr2));
        vm.prank(owner);
        nft.setMerkleRoot(newRoot2);
        bytes32 _newRoot = keccak256(abi.encodePacked(addr1));
        vm.startPrank(owner);
        gasBefore = gasleft();
        nft.setMerkleRoot(_newRoot);
        gasAfter = gasleft();
        merkleTotal = gasBefore - gasAfter;
        vm.stopPrank();

        // --- Mapping remove ---
        vm.startPrank(owner);
        // DO NOT addToWhitelist(addr1) again here!
        gasBefore = gasleft();
        removeFromWhitelist(addr1);
        gasAfter = gasleft();
        mappingTotal += gasBefore - gasAfter;
        vm.stopPrank();

        // --- Merkle verify proof ---
        vm.startPrank(owner);
        gasBefore = gasleft();
        verifyProof(addr1, addr1Proof);
        gasAfter = gasleft();
        merkleTotal += gasBefore - gasAfter;
        vm.stopPrank();

        // --- Mapping verify ---
        vm.startPrank(owner);
        gasBefore = gasleft();
        isMapWhitelisted(addr1);
        gasAfter = gasleft();
        mappingTotal += gasBefore - gasAfter;
        vm.stopPrank();



        // --- Log results ---
        emit log_named_uint("MerkleTree total gas usage :", merkleTotal);
        emit log_named_uint("Mapping Whitelist total gas usage :", mappingTotal);
    }

}