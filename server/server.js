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
    const merkleRoot = '0x' + tree.getRoot().toString('hex');
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
    const proof = tree.getProof(leaf).map(x => '0x' + x.data.toString('hex')); // Generate proof with '0x' prefix for hex strings

    res.json({ proof });
});


app.post('/addAddress', (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    const whitelist = getWhitelist();

    if (whitelist.includes(address)) {
        return res.status(400).send('Address already exists in the whitelist');
    }

    whitelist.push(address);

    try {
        fs.writeFileSync(whitelistFilePath, JSON.stringify(whitelist, null, 2));
        const { tree, merkleRoot } = generateMerkleTree(whitelist);
        return res.json({ message: 'Address added successfully', merkleRoot });
    } catch (error) {
        console.error('Error writing to whitelist:', error);
        return res.status(500).send('Error writing to whitelist');
    }
});

app.post('/removeAddress', (req, res) => {
    const {address} = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    const whitelist = getWhitelist();

    if (!whitelist.includes(address)) {
        return res.status(400).send('Address does not exist in the whitelist');
    }

    const updatedWhitelist = whitelist.filter(addr => addr !== address);

    try {
        fs.writeFileSync(whitelistFilePath, JSON.stringify(updatedWhitelist, null, 2));
        const { tree, merkleRoot } = generateMerkleTree(updatedWhitelist);
        return res.json({ message: 'Address removed successfully', merkleRoot });

    } catch (error) {
        console.error('Error writing to whitelist:', error);
        return res.status(500).send('Error writing to whitelist');
    }   
})

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
