// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IRolesManger.sol";

abstract contract MerkleWhiteList {
    using MerkleProof for bytes32[];

    bytes32 public merkleRoot;  
    IRolesManager public rolesManager;

    event MerkleRootUpdated(bytes32 newMerkleRoot);

    constructor(address _rolesManagerAddress) {
        rolesManager = IRolesManager(_rolesManagerAddress);
    }


    function setMerkleRoot(bytes32 newRoot) external {
        require(rolesManager.hasRole(keccak256("WHITELIST_MANAGER"), msg.sender), "Not whitelisted");
        merkleRoot = newRoot;
        emit MerkleRootUpdated(newRoot);
    }

}