# Eco Lens - Smart Plastic Sorting AI 🌱♻️

**Eco Lens** (formerly Plasti Sort) is an intelligent mobile application designed to revolutionize how we handle plastic waste. Powered by advanced AI, it helps users instantly identify plastic types, understand their recyclability, and track their environmental impact.

## 🚀 Features

*   **🤖 AI-Powered Scanning:** Instantly identify plastic types (PET, HDPE, PVC, etc.) using your camera.
*   **📊 Impact Tracking:** Track your carbon footprint reduction and plastic saved in real-time.
*   **🎮 Gamification:** Earn points, maintain streaks, and unlock achievements for your eco-friendly actions.
*   **📚 Educational Hub:** Learn about recycling symbols, plastic types, and sustainable practices through interactive quizzes and articles.
*   **📍 Bin Locator:** Find the nearest recycling bins and centers (Coming Soon).
*   **🌍 Community Leaderboard:** Compete with friends and the global community to see who can save the most plastic.

## 🛠️ Tech Stack

*   **Frontend:** React Native with Expo (Managed Workflow)
*   **Backend/Auth:** Firebase (Auth, Firestore)
*   **AI/ML:** Ola Krutrim AI (Gemma-3-27B-IT Model) for image classification
*   **Storage:** Cloudinary for image optimization and storage
*   **Animations:** Lottie React Native
*   **Navigation:** React Navigation (Stack & Bottom Tabs)

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   Expo Go app on your physical device (Android/iOS)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/eco-lens.git
    cd eco-lens
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    FIREBASE_API_KEY=your_api_key
    FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    FIREBASE_APP_ID=your_app_id
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_UPLOAD_PRESET=your_preset
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    AI_CLASSIFICATION_ENDPOINT=your_ai_endpoint
    ```

4.  **Start the app:**
    ```bash
    npx expo start
    ```

5.  **Run on Device:**
    *   Scan the QR code with the Expo Go app (Android) or Camera app (iOS).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

*   Built with ❤️ for a greener planet.
*   Special thanks to the Expo and React Native communities.
