const express = require('express');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');


// Allow all origins (open CORS)
app.use(cors());
app.use(express.json());


const whitelistFilePath= './whitelist.json';

const getWhitelist = () => {
    try {
      const data = fs.readFileSync(whitelistFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading whitelist:', err);
      return [];
    }
};

const generateMerkleTree = (addresses) => {
    const leaves = addresses.map(addr => keccak256(addr)); 
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = tree.getRoot().toString('hex');
    return { tree, merkleRoot };
};

const { tree, merkleRoot } = generateMerkleTree(getWhitelist());

// Route to get the Merkle root
app.get('/getMerkleRoot', (req, res) => {
    const { merkleRoot } = generateMerkleTree(getWhitelist()); 
    res.json({ merkleRoot: merkleRoot });
});

// Route to get the Merkle proof for an address
app.post('/getProof', (req, res) => {
    const { address } = req.body;
    if (!address) {
    return res.status(400).send('Address is required');
    }

    const leaf = keccak256(address); // Hash the address
    const proof = tree.getProof(leaf).map(x => x.data.toString('hex')); // Generate proof
    res.json({ proof });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
