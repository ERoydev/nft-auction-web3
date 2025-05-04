import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_API_KEY_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});


export async function uploadFileToPinata(
    name: string,
    description: string,
    image: File,
) {
    try {   
        // 1. Upload the image to Pinata
        const imageUpload = await pinata.upload.public.file(image);
        const imageCID = imageUpload.cid;
        const imageUrl = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${imageCID}`;


        // 2. Create metadata
        const metadata = {
            name,
            description,
            image: imageUrl,
        };

        const metadataBlob = new Blob([JSON.stringify(metadata)], 
        { type: "application/json",
        });

        const metadatFile = new File([metadataBlob], "metadata.json");

        // 4. Upload metadata to IPFS
        const metadataUpload = await pinata.upload.public.file(metadatFile);

        console.log("Image CID:", imageCID);
        console.log("Metadata CIT:", metadataUpload.cid);


        return {
            imageCID,
            metadataCID: metadataUpload.cid,
            metadataURL: `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${metadataUpload.cid}`,
        }
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
}
