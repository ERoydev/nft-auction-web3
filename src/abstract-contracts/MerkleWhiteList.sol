// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


abstract contract MerkleWhiteList {
    using MerkleProof for bytes32[];

    bytes32 public merkleRoot;  

    event MerkleRootUpdated(bytes32 newMerkleRoot);

    function setMerkleRoot(bytes32 newRoot) external virtual;

    function _isWhitelisted(address account, bytes32[] calldata merkleProof) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(merkleProof, merkleRoot, leaf);
    }

    modifier onlyWhitelisted(bytes32[] calldata merkleProof) {
        require(_isWhitelisted(msg.sender, merkleProof), "not whitelisted");
        _;
    }

}