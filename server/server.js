import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { solidityPackedKeccak256, getAddress } from 'ethers';
import fs from 'fs';
import cors from 'cors';
import { getRolesForUser } from './methods.js';


const app = express();
const port = 3000;

// Allow all origins (open CORS)
app.use(cors());
app.use(express.json());

const whitelistFilePath = './whitelist.json';
const databasePath = './database.json';

// Initialize the whitelist with the initial admin address
const initializeWhitelist = () => {
    const initialAdminAddress = process.env.INITIAL_ADMIN_ADDRESS;

    if (!initialAdminAddress) {
        console.error('INITIAL_ADMIN_ADDRESS is not defined in .env');
        process.exit(1); // Exit the process if the admin address is not defined
    }

    // Normalize the admin address
    const normalizedAdminAddress = getAddress(initialAdminAddress);

    // Create a new whitelist with only the admin address
    const whitelist = [normalizedAdminAddress];

    try {
        fs.writeFileSync(whitelistFilePath, JSON.stringify(whitelist, null, 2));
        console.log('Whitelist initialized with the initial admin address:', normalizedAdminAddress);
    } catch (error) {
        console.error('Error initializing whitelist:', error);
        process.exit(1); // Exit the process if there's an error
    }

    return whitelist;
};

// Initialize the whitelist and Merkle tree on server startup
const whitelist = initializeWhitelist(); // Reset the whitelist

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

    const normalizedAddress = getAddress(address);

    const whitelist = getWhitelist();

    // If there's only one address in the whitelist
    if (whitelist.length === 1) {
        // Check if the provided address exists in the whitelist
        if (whitelist[0] !== normalizedAddress) {
            return res.status(400).send('Address does not exist in the whitelist');
        }

        // If the address exists, return an empty proof
        return res.json({ proof: [] });
    }

    // Check if the address exists in the whitelist
    if (!whitelist.includes(normalizedAddress)) {
        return res.status(400).send('Address does not exist in the whitelist');
    }

    // Generate the leaf for the provided address
    const leaf = Buffer.from(solidityPackedKeccak256(['address'], [normalizedAddress]).slice(2), 'hex');

    // Generate the proof
    const proof = tree.getProof(leaf).map(x => '0x' + x.data.toString('hex'));

    res.json({ proof });
});


app.post('/addAddress', (req, res) => {
    const { address, senderRole } = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    // Normalize the address to ensure consistency
    const normalizedAddress = getAddress(address);
    totalWhitelistedUsers++; // Increment the total whitelisted users count in DB


    // Step 1: Delete the address from the database if it exists
    try {
        const data = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

        if (data[normalizedAddress]) {
            delete data[normalizedAddress];
            fs.writeFileSync(databasePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Address ${normalizedAddress} deleted from the database`);
        }
    } catch (err) {
        console.error('Error deleting address from database:', err);
        return res.status(500).send('Error deleting address from database');
    }

    // Step 2: Add the address to the whitelist
    const whitelist = getWhitelist();

    if (whitelist.includes(normalizedAddress)) {
        return res.status(400).send('Address already exists in the whitelist');
    }

    whitelist.push(normalizedAddress);

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

    // Normalize the address to ensure consistency
    const normalizedAddress = getAddress(address);

    const whitelist = getWhitelist();

    totalWhitelistedUsers--; // Decrement the total whitelisted users count in DB

    if (!whitelist.includes(normalizedAddress)) {
        return res.status(400).send('Address does not exist in the whitelist');
    }

    const updatedWhitelist = whitelist.filter(addr => addr !== normalizedAddress);

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

    const normalizedAddress = getAddress(address);

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
        if (database[normalizedAddress]) {
            console.log("Returning roles from database");
            return res.json({ roles: database[normalizedAddress] });
        }

        // Fetch roles if not already in the database
        const roles = await getRolesForUser(normalizedAddress);

        console.log("Fetched roles from contract", roles);

        if (!roles) {
            return res.status(500).send('Could not retrieve roles');
        }

        // Add the address and roles to the database
        database[normalizedAddress] = roles;

        // Write to the database only if the address is new
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

        return res.json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).send('Error fetching roles');
    }
});


// STATISTICS STUFF

// Simple in-memory database to keep track of the number of NFTs minted
// This should be replaced with a proper database in production
let nftMintedCount = 0;
let platformRevenue = 0; // In ETH
let totalWhitelistedUsers = 1; // Initial admin

app.get('/adminStatistics', (req, res) => {
    res.json({ nftMintedCount, platformRevenue, totalWhitelistedUsers });
});

app.post('/mintNft', (req, res) => {
    nftMintedCount++;
});

app.post('/revenue', (req, res) => {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).send('Amount is required');
    }
    platformRevenue += amount;
    res.json({ message: 'Revenue updated successfully', platformRevenue });
});

// TODO: Add route for tokenData for tokenId. To skip refetching the same data through my frontend components


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
