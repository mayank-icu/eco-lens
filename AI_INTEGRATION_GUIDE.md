# 🤖 AI Model Integration Guide

## Overview
This guide shows how to replace the mock AI classification with a real AI model for plastic type detection.

## Current Mock Implementation

Location: `src/services/scanService.ts`

The mock classifier currently:
- Simulates 1.5 second API delay
- Returns random plastic type (PET, HDPE, PP, etc.)
- Generates 75-95% confidence score
- Provides educational information
- Calculates CO2 impact

## Option 1: OpenAI Vision API

### Step 1: Install OpenAI SDK
```bash
npm install openai
```

### Step 2: Add API Key to .env
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 3: Replace Mock Function

**File:** `src/services/scanService.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const classifyPlastic = async (imageUri: string): Promise<{
  plasticType: PlasticType;
  confidence: number;
  binColor: BinColor;
  co2Saved: number;
  educationalInfo: string;
}> => {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify the plastic type in this image. The recycling symbol should indicate the number (1-7). Return JSON with: plasticType (PET/HDPE/PVC/LDPE/PP/PS/OTHER), confidence (0-100), and a brief educational fact."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Map to your PlasticType enum
    const plasticType = result.plasticType as PlasticType;
    
    // Determine bin color and CO2 impact
    const plasticInfo = getPlasticInfo(plasticType);

    return {
      plasticType,
      confidence: result.confidence,
      binColor: plasticInfo.binColor,
      co2Saved: plasticInfo.co2,
      educationalInfo: result.educationalInfo || plasticInfo.info,
    };
  } catch (error) {
    console.error('AI Classification Error:', error);
    throw new Error('Failed to classify plastic');
  }
};

// Helper function to convert image to base64
const imageToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
```

## Option 2: TensorFlow Lite (On-Device)

### Step 1: Install TensorFlow
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
expo install expo-gl
```

### Step 2: Load Pre-trained Model

```typescript
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let model: tf.LayersModel | null = null;

export const loadModel = async () => {
  await tf.ready();
  const modelJson = require('../assets/models/plastic_classifier/model.json');
  const modelWeights = require('../assets/models/plastic_classifier/weights.bin');
  
  model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
};

export const classifyPlastic = async (imageUri: string) => {
  if (!model) await loadModel();
  
  // Preprocess image
  const imageTensor = await preprocessImage(imageUri);
  
  // Run prediction
  const predictions = await model.predict(imageTensor) as tf.Tensor;
  const probabilities = await predictions.data();
  
  // Get highest probability class
  const maxProb = Math.max(...probabilities);
  const classIndex = probabilities.indexOf(maxProb);
  
  const plasticTypes = [PlasticType.PET, PlasticType.HDPE, PlasticType.PVC, 
                        PlasticType.LDPE, PlasticType.PP, PlasticType.PS, 
                        PlasticType.OTHER];
  
  const plasticType = plasticTypes[classIndex];
  const confidence = maxProb * 100;
  
  const info = getPlasticInfo(plasticType);
  
  return {
    plasticType,
    confidence,
    binColor: info.binColor,
    co2Saved: info.co2,
    educationalInfo: info.info,
  };
};

const preprocessImage = async (uri: string) => {
  const response = await fetch(uri);
  const imageData = await response.blob();
  const imageTensor = await tf.browser.fromPixels(imageData);
  
  // Resize to model input size (e.g., 224x224)
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  
  // Normalize pixel values to [0, 1]
  const normalized = resized.div(255.0);
  
  // Add batch dimension
  return normalized.expandDims(0);
};
```

## Option 3: Custom API Endpoint

### Create Your Own Backend

**File:** `src/services/scanService.ts`

```typescript
export const classifyPlastic = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'plastic.jpg',
  } as any);

  const response = await fetch(process.env.AI_CLASSIFICATION_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Classification failed');
  }

  const data = await response.json();
  
  return {
    plasticType: data.plastic_type as PlasticType,
    confidence: data.confidence,
    binColor: data.bin_color as BinColor,
    co2Saved: data.co2_saved,
    educationalInfo: data.educational_info,
  };
};
```

### Backend Example (Python + FastAPI)

```python
from fastapi import FastAPI, File, UploadFile
from tensorflow import keras
import numpy as np
from PIL import Image

app = FastAPI()
model = keras.models.load_model('plastic_classifier.h5')

PLASTIC_TYPES = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER']

@app.post("/api/classify")
async def classify_plastic(image: UploadFile = File(...)):
    # Load and preprocess image
    img = Image.open(image.file).resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, 0)
    
    # Predict
    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx]) * 100
    
    plastic_type = PLASTIC_TYPES[class_idx]
    bin_color = 'green' if plastic_type in ['PET', 'HDPE', 'PP'] else 'red'
    
    return {
        'plastic_type': plastic_type,
        'confidence': confidence,
        'bin_color': bin_color,
        'co2_saved': calculate_co2(plastic_type),
        'educational_info': get_info(plastic_type)
    }
```

## Option 4: Google Cloud Vision API

```typescript
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'path/to/service-account.json',
});

export const classifyPlastic = async (imageUri: string) => {
  const [result] = await client.labelDetection(imageUri);
  const labels = result.labelAnnotations;
  
  // Extract plastic type from labels
  const plasticLabel = labels.find(label => 
    label.description.toLowerCase().includes('plastic')
  );
  
  // Custom logic to map labels to plastic types
  const plasticType = mapLabelToPlasticType(labels);
  
  const info = getPlasticInfo(plasticType);
  
  return {
    plasticType,
    confidence: plasticLabel?.score * 100 || 50,
    binColor: info.binColor,
    co2Saved: info.co2,
    educationalInfo: info.info,
  };
};
```

## Testing Your Integration

### 1. Update ScanScreen to Use Real Camera

**File:** `src/screens/ScanScreen.tsx`

```typescript
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const handleCapture = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync();
    
    setScanning(true);
    try {
      const result = await classifyPlastic(photo.uri);
      setResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to classify plastic');
    } finally {
      setScanning(false);
    }
  }
};

const handleGalleryUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    setScanning(true);
    try {
      const classResult = await classifyPlastic(result.assets[0].uri);
      setResult(classResult);
    } catch (error) {
      Alert.alert('Error', 'Failed to classify plastic');
    } finally {
      setScanning(false);
    }
  }
};
```

### 2. Test with Sample Images

Create test images:
- `assets/test-images/pet-bottle.jpg`
- `assets/test-images/hdpe-milk-jug.jpg`
- `assets/test-images/pp-container.jpg`

### 3. Error Handling

```typescript
export const classifyPlastic = async (imageUri: string) => {
  try {
    // Your AI logic here
    
  } catch (error) {
    console.error('Classification error:', error);
    
    // Fallback to mock data if AI fails
    return getMockClassification();
  }
};

const getMockClassification = () => {
  return {
    plasticType: PlasticType.PET,
    confidence: 50,
    binColor: BinColor.GREEN,
    co2Saved: 45,
    educationalInfo: 'Unable to classify. Please try again.',
  };
};
```

## Performance Optimization

### 1. Image Compression
```typescript
import * as ImageManipulator from 'expo-image-manipulator';

const compressImage = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};
```

### 2. Caching Results
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCachedResult = async (imageHash: string) => {
  const cached = await AsyncStorage.getItem(`scan_${imageHash}`);
  return cached ? JSON.parse(cached) : null;
};

const cacheResult = async (imageHash: string, result: any) => {
  await AsyncStorage.setItem(`scan_${imageHash}`, JSON.stringify(result));
};
```

## Cost Estimation

| Service | Cost per 1000 requests | Notes |
|---------|------------------------|--------|
| **OpenAI Vision** | ~$0.01 - $0.03 | Pay per token |
| **Google Cloud Vision** | ~$1.50 | Free tier: 1000/month |
| **Custom TensorFlow** | Free | One-time model training |
| **AWS Rekognition** | ~$1.00 | Free tier: 5000/month |

## Recommended Approach

For **PlastiSort AI**, I recommend:

1. **Phase 1 (Now):** Use mock data for testing and UI development ✅
2. **Phase 2:** Train custom TensorFlow model on plastic images
3. **Phase 3:** Deploy model with TensorFlow Lite for on-device inference
4. **Phase 4:** Add OpenAI Vision as fallback for low confidence results

This gives you:
- ✅ Fast, offline classification
- ✅ No API costs for most users
- ✅ High accuracy with custom training
- ✅ Fallback for edge cases

## Next Steps

1. Collect plastic recycling symbol images (1000+ per type)
2. Train model using transfer learning (ResNet50/MobileNetV2)
3. Convert to TensorFlow Lite
4. Replace mock function in `scanService.ts`
5. Test accuracy on real-world images
6. Deploy!

---

**Current mock is in:** `src/services/scanService.ts` line 14-65  
**Just replace the `classifyPlastic` function when ready!**
