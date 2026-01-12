import { Platform } from 'react-native';

const CLOUD_NAME = 'duogmkv22';
const UPLOAD_PRESET = 'eco-lens';

/**
 * Upload a file to Cloudinary with automatic optimization and compression
 * @param {string} imageUri - The local URI of the image to upload
 * @returns {Promise<Object>} Upload response with URL and metadata
 */
export const uploadToCloudinary = async (imageUri: string) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration is missing');
    }

    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'upload.jpg';

    if (Platform.OS === 'web') {
        // Web: Fetch the blob from the blob URL
        const response = await fetch(imageUri);
        const blob = await response.blob();
        (formData as any).append('file', blob, filename);
    } else {
        // Mobile: Use the special object format
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        const file = {
            uri: imageUri,
            name: filename,
            type: type,
        } as any;

        formData.append('file', file);
    }

    formData.append('upload_preset', UPLOAD_PRESET);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                // Content-Type is handled automatically by fetch when using FormData
                // Do NOT set 'Content-Type': 'multipart/form-data' manually here, 
                // as it breaks the boundary generation.
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Upload failed');
        }

        const data = await response.json();

        // Create a compressed transformation URL
        // w_1200 = max width 1200px (resize if larger)
        // q_auto:low = automatic quality optimization (aggressive compression)
        // f_auto = automatic best format selection (WebP when supported)
        const transformations = 'w_1200,q_auto:low,f_auto';
        const urlParts = data.secure_url.split('/upload/');
        const finalUrl = `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;

        return {
            url: finalUrl,
            publicId: data.public_id,
            deleteToken: data.delete_token, // Capture delete_token if available
            format: data.format,
            resourceType: data.resource_type,
            bytes: data.bytes,
            width: data.width,
            height: data.height,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a file from Cloudinary using the delete token
 * @param {string} publicId - The public ID of the image
 * @param {string} deleteToken - The token allowing deletion (valid for 10 mins)
 */
export const deleteFromCloudinary = async (_publicId: string, deleteToken?: string) => {
    if (!deleteToken) {
        return;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`;
    const formData = new FormData();
    formData.append('token', deleteToken);

    try {
        await fetch(url, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        // Silent fail
    }
};
