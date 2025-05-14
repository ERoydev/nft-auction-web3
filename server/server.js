import express from 'express';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { solidityPackedKeccak256, getAddress } from 'ethers';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import { getRolesForUser } from './methods.js';



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
    const { address } = req.body;

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

        // Check if the address already exists in the database
        if (database[address]) {
            console.log("Returning roles from database");
            return res.json({ roles: database[address] });
        }

        // Fetch roles if not already in the database
        const roles = await getRolesForUser(address);

        if (!roles) {
            return res.status(500).send('Could not retrieve roles');
        }

        // Add the address and roles to the database
        database[address] = roles;

        // Write to the database only if the address is new
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

        return res.json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).send('Error fetching roles');
    }
});

// Used to delete the address from the database, because he need to fetch his roles again. Used after admin has made an operation that changes the roles of the user
app.post('/deleteAddress', (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    try {
        const data = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

        if (!data[address]) {
            return res.status(200).send('Address does not exist in the database');
        }

        delete data[address];

        fs.writeFileSync(databasePath, JSON.stringify(data, null, 2), 'utf8');

        return res.status(200).send('Address deleted successfully');
    } catch (err) {
        console.error('Error deleting address:', err);
        return res.status(500).send('Error deleting address');
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
