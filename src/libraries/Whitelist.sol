// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

library Whitelist {
    function verifyWhitelist(address user, bytes32[] memory merkleProof, bytes32 root) internal pure returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(user));
        return MerkleProof.verify(merkleProof, root, leaf);
    }

}