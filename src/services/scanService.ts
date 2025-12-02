import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Scan, PlasticType, BinColor } from '../types';

// Mock AI Classification (to be replaced with real API)
export const classifyPlastic = async (imageUri: string): Promise<{
    plasticType: PlasticType;
    confidence: number;
    binColor: BinColor;
    co2Saved: number;
    educationalInfo: string;
}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock classification result
    const plasticTypes = [PlasticType.PET, PlasticType.HDPE, PlasticType.PP, PlasticType.LDPE, PlasticType.PVC, PlasticType.PS];
    const randomType = plasticTypes[Math.floor(Math.random() * plasticTypes.length)];
    const confidence = 75 + Math.random() * 20; // 75-95%

    const plasticInfo: Record<PlasticType, { binColor: BinColor; co2: number; info: string }> = {
        [PlasticType.PET]: {
            binColor: BinColor.GREEN,
            co2: 45,
            info: 'PET (Polyethylene Terephthalate) is commonly used for water bottles and is highly recyclable.',
        },
        [PlasticType.HDPE]: {
            binColor: BinColor.GREEN,
            co2: 52,
            info: 'HDPE (High-Density Polyethylene) is used for milk jugs and detergent bottles. Widely recyclable.',
        },
        [PlasticType.PP]: {
            binColor: BinColor.GREEN,
            co2: 38,
            info: 'PP (Polypropylene) is used for food containers and yogurt cups. Recyclable in many areas.',
        },
        [PlasticType.LDPE]: {
            binColor: BinColor.YELLOW,
            co2: 28,
            info: 'LDPE (Low-Density Polyethylene) is used for plastic bags. Requires cleaning before recycling.',
        },
        [PlasticType.PVC]: {
            binColor: BinColor.RED,
            co2: 15,
            info: 'PVC (Polyvinyl Chloride) is difficult to recycle. Check with local facilities.',
        },
        [PlasticType.PS]: {
            binColor: BinColor.RED,
            co2: 18,
            info: 'PS (Polystyrene) is rarely recyclable. Consider alternatives.',
        },
        [PlasticType.OTHER]: {
            binColor: BinColor.YELLOW,
            co2: 25,
            info: 'Mixed plastics may have limited recyclability. Check local guidelines.',
        },
    };

    const result = plasticInfo[randomType];

    return {
        plasticType: randomType,
        confidence,
        ...result,
        educationalInfo: result.info,
    };
};

// Save scan to Firestore
export const saveScan = async (
    userId: string,
    plasticType: PlasticType,
    confidence: number,
    binColor: BinColor,
    co2Saved: number,
    imageUrl?: string
): Promise<void> => {
    const scanData: Omit<Scan, 'id'> = {
        userId,
        plasticType,
        confidence,
        timestamp: new Date(),
        weight: Math.random() * 100 + 50, // estimated weight in grams
        co2Saved,
        binColor,
        imageUrl: imageUrl || null,
    };

    await addDoc(collection(db, 'scans'), scanData);

    // Update user stats
    // TODO: Implement user stats update
};

// Get user's scan history
export const getUserScans = async (userId: string, limitCount: number = 20): Promise<Scan[]> => {
    const scansRef = collection(db, 'scans');
    const q = query(
        scansRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(), // Convert Firestore Timestamp to Date
        } as Scan;
    });
};
