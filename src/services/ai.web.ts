// Web implementation of AI service (Mock/No-op)
// This file is loaded automatically by Metro when bundling for web

export const PLASTIC_CLASSES = [
    { id: 'PET', name: 'PET', binColor: 'green', description: 'Polyethylene Terephthalate' },
    { id: 'HDPE', name: 'HDPE', binColor: 'green', description: 'High-Density Polyethylene' },
    { id: 'PVC', name: 'PVC', binColor: 'red', description: 'Polyvinyl Chloride' },
    { id: 'LDPE', name: 'LDPE', binColor: 'red', description: 'Low-Density Polyethylene' },
    { id: 'PP', name: 'PP', binColor: 'green', description: 'Polypropylene' },
    { id: 'PS', name: 'PS', binColor: 'red', description: 'Polystyrene' },
];

export const loadModel = async (): Promise<boolean> => {
    console.log('AI Model not supported on web');
    return false;
};

export const runInference = async (imageUri: string) => {
    console.log('Running mock inference on web for:', imageUri);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomIndex = Math.floor(Math.random() * PLASTIC_CLASSES.length);
    const confidence = 0.7 + Math.random() * 0.25;

    return {
        plasticType: PLASTIC_CLASSES[randomIndex].id,
        confidence: confidence,
        binColor: PLASTIC_CLASSES[randomIndex].binColor,
        name: PLASTIC_CLASSES[randomIndex].name
    };
};
