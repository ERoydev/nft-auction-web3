const fs = require('fs');
const path = require('path');

// `node script/CopyABI.js` ====> Execution command

// Define the source and destination paths
const sourcePath = path.join(__dirname, '../out/NFT.sol/NFT.json');
const destinationPath = path.join(__dirname, '../frontend/src/abi/NFT.json');


// Ensure the destination directory exists
const destinationDir = path.dirname(destinationPath);
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

// Read the ABI from the source file
fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the source file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const abi = jsonData.abi;

        // Write the ABI to the destination file
        fs.writeFile(destinationPath, JSON.stringify(abi, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing the ABI to the destination file:', err);
            } else {
                console.log('ABI successfully copied to:', destinationPath);
            }
        });
    } catch (parseError) {
        console.error('Error parsing the source file JSON:', parseError);
    }
});