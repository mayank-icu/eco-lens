import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary';

// Plastic types mapping
export const PLASTIC_CLASSES = [
    { id: 'PET', name: 'PET', binColor: 'green', description: 'Polyethylene Terephthalate' },
    { id: 'HDPE', name: 'HDPE', binColor: 'green', description: 'High-Density Polyethylene' },
    { id: 'PVC', name: 'PVC', binColor: 'red', description: 'Polyvinyl Chloride' },
    { id: 'LDPE', name: 'LDPE', binColor: 'red', description: 'Low-Density Polyethylene' },
    { id: 'PP', name: 'PP', binColor: 'green', description: 'Polypropylene' },
    { id: 'PS', name: 'PS', binColor: 'red', description: 'Polystyrene' },
];

const OLA_KRUTRIM_API_KEY = '#';
const OLA_KRUTRIM_URL = '#';

export const loadModel = async (): Promise<boolean> => {
    return true;
};

const compressImage = async (uri: string) => {
    try {
        const result = await manipulateAsync(
            uri,
            [{ resize: { width: 512 } }], 
            { compress: 0.7, format: SaveFormat.JPEG } 
        );
        return result.uri;
    } catch (error) {
        return uri; // Fallback to original if compression fails
    }
};

export const runInference = async (imageUri: string) => {
    let uploadedPublicId: string | null = null;
    let deleteToken: string | undefined;

    try {
        // 1. Compress Image (Client-side optimization)
        const compressedUri = await compressImage(imageUri);

        // 2. Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(compressedUri);
        uploadedPublicId = uploadResult.publicId;
        deleteToken = uploadResult.deleteToken;

        // 3. Call Ola Krutrim AI
        const aiResult = await analyzeWithOlaKrutrim(uploadResult.url);

        return aiResult;

    } catch (error) {
        return null;
    } finally {
        // 4. Cleanup (Auto-delete)
        if (uploadedPublicId && deleteToken) {
            deleteFromCloudinary(uploadedPublicId, deleteToken).catch(() => { });
        }
    }
};

async function analyzeWithOlaKrutrim(imageUrl: string) {
    // Optimized prompt for token efficiency and recycling awareness
    const prompt = `
    Analyze this image. Is it a plastic item?
    If YES, identify type (PET, HDPE, PVC, LDPE, PP, PS).
    If NO (e.g. paper, metal, glass, organic, screenshot, text, digital art, person, black screen, blurry), set id="NOT_PLASTIC".
    
    Return strict JSON:
    {
        "id": "TYPE_OR_NOT_PLASTIC_OR_UNKNOWN",
        "confidence": 0.0-1.0,
        "name": "Item Name",
        "description": "Brief ID reason",
        "recycling_tip": "Specific recycling tip for this item type. If NOT_PLASTIC, explain why it's not plastic."
    }
    `;

    try {
        const response = await fetch(OLA_KRUTRIM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OLA_KRUTRIM_API_KEY}`
            },
            body: JSON.stringify({
                model: "Gemma-3-27B-IT",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: imageUrl } }
                        ]
                    }
                ],
                max_tokens: 200,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`Ola Krutrim API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) throw new Error('No content in AI response');

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const result = JSON.parse(jsonString);

        if (result.id === 'NOT_PLASTIC') {
            return {
                plasticType: 'Not Plastic',
                confidence: result.confidence || 0.9,
                binColor: 'gray',
                name: result.name || 'Non-Plastic Item',
                educationalInfo: result.description || "This item does not appear to be plastic.",
                recyclable: false,
                isPlastic: false
            };
        }

        // Map to our app's format
        const plasticClass = PLASTIC_CLASSES.find(p => p.id === result.id);

        if (plasticClass) {
            return {
                plasticType: plasticClass.id,
                confidence: result.confidence || 0.8,
                binColor: plasticClass.binColor,
                name: result.name || plasticClass.name,
                educationalInfo: `${result.description} ${result.recycling_tip ? `\n\n♻️ Tip: ${result.recycling_tip}` : ''}`,
                recyclable: plasticClass.binColor === 'green',
                isPlastic: true
            };
        } else {
            // Handle UNKNOWN or unmapped types
            return {
                plasticType: 'Unknown',
                confidence: result.confidence || 0.5,
                binColor: 'gray',
                name: result.name || 'Unknown Item',
                educationalInfo: result.description || "Could not identify the plastic type. Please check the recycling code manually.",
                recyclable: false,
                isPlastic: false // Treat unknown as potentially not plastic for safety, or just unknown
            };
        }

    } catch (error) {
        throw error;
    }
}
