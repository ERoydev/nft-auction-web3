1. forge script .... Deploy the NFT contract
2. node script/CopyABI.js to update the abi contract in the frontend
3. update the .env's with the new contract address (frontend/foundry)
4. mint NFT's again since they are all losted

# Locally the anvil addresses that i use are:
- (0): I use for deployment (DEFAULT_ADMIN) -> Account 2 in metamask
- (9): I use for WhitelistManager -> Account 4 in metamask

# Errors that occured during developments that are good to note

## 1. When i work on JS/TS and i want to hash address which my smart contract expects as bytes32
 - Backend was hashing addresses with just keccak256(address) — a plain string hash — while smart contract likely expected keccak256(abi.encodePacked(address)) like Solidity  does. That mismatch is why the proofs were invalid (resulting in false in cast call).
 - solidityPackedKeccak256(...) = mimics abi.encodePacked + keccak256 from Solidity
 - If the hash of your leaf in JS doesn’t match the one Solidity expects, the Merkle proof won’t validate — ever.
