const express = require('express');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { solidityPackedKeccak256, getAddress } = require('ethers');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const { getRolesForUser } = require('./methods');


const app = express();
const port = 3000;
dotenv.config();

// Allow all origins (open CORS)
app.use(cors());
app.use(express.json());

const whitelistFilePath = './whitelist.json';
const databasePath = './database.json';

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
    const leaves = addresses.map(addr =>
        Buffer.from(solidityPackedKeccak256(['address'], [getAddress(addr)]).slice(2), 'hex')
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = '0x' + tree.getRoot().toString('hex');
    return { tree, merkleRoot };
};

let { tree, merkleRoot } = generateMerkleTree(getWhitelist());

// Route to get the Merkle root
app.get('/getMerkleRoot', (req, res) => {
    const { merkleRoot } = generateMerkleTree(getWhitelist());
    res.json({ merkleRoot });
});

// Route to get the Merkle proof for an address
app.post('/getProof', (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).send('Address is required');
    }

    const leaf = Buffer.from(solidityPackedKeccak256(['address'], [getAddress(address)]).slice(2), 'hex');
    const proof = tree.getProof(leaf).map(x => '0x' + x.data.toString('hex'));

    res.json({ proof });
});

// Add address to whitelist
app.post('/addAddress', (req, res) => {
    const { address, senderRole } = req.body;

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
        const result = generateMerkleTree(whitelist);
        tree = result.tree;
        merkleRoot = result.merkleRoot;
        return res.json({ message: 'Address added successfully', merkleRoot });
    } catch (error) {
        console.error('Error writing to whitelist:', error);
        return res.status(500).send('Error writing to whitelist');
    }
});

// Remove address from whitelist
app.post('/removeAddress', (req, res) => {
    const { address } = req.body;

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
        const result = generateMerkleTree(updatedWhitelist);
        tree = result.tree;
        merkleRoot = result.merkleRoot;
        return res.json({ message: 'Address removed successfully', merkleRoot });
    } catch (error) {
        console.error('Error writing to whitelist:', error);
        return res.status(500).send('Error writing to whitelist');
    }
});

app.post('/roles', async (req, res) => {
    const { address} = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    try {
        // Read the database
        let database = {};
        try {
            const data = fs.readFileSync(databasePath, 'utf8');
            database = JSON.parse(data);
        } catch (err) {
            console.error('Error reading database:', err);
        }

        if (database[address]) {
            console.log("Returning roles from database");
            return res.json({roles: database[address]});
        }

        const roles = await getRolesForUser(address); // use your helper function
    
        if (!roles) {
            return res.status(500).send('Could not retrieve roles');
        }

        database[address] = roles;
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2)); // Save in the database
    
        return res.json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).send('Error fetching roles');
    }
});
  

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
