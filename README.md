Github Link: https://github.com/joeyssn/ALP_AI

# WasteSorter  
AI-Powered Waste Classification Web Application

## Project Overview
WasteSorter is a web-based application that uses Artificial Intelligence to classify waste into categories such as organic, recyclable, and hazardous. The system integrates a Teachable Machine image classification model into a React and TypeScript frontend, allowing users to upload images or use live camera input for real-time waste detection.

This project is developed as an academic and prototype-level solution to demonstrate client-side AI usage for environmental awareness and waste management.

---

## Features
- Image upload-based waste classification  
- Real-time waste detection using webcam  
- Client-side AI inference without a backend  
- Fast prediction using TensorFlow.js  
- Responsive and modern user interface  

---

## AI Model
- Platform: Google Teachable Machine  
- Model Type: Image Classification  
- Architecture: MobileNet (TensorFlow.js)  
- Inference runs entirely in the browser  

Note: Teachable Machine is suitable for prototyping and educational purposes. For production use, a custom-trained model with a larger dataset is recommended.

---

## Technology Stack
- Frontend: React with TypeScript  
- Styling: Tailwind CSS  
- AI Framework: TensorFlow.js  
- Model Loader: @teachablemachine/image  
- Routing: React Router  

---

## Project Structure

src/
├── pages/
│ ├── Homepage.tsx
│ ├── ClassifyPage.tsx
│ └── About.tsx
├── App.tsx
├── main.tsx
└── index.css

---

## Application Flow
1. The AI model is loaded once when the application initializes.  
2. Users upload an image or activate the webcam.  
3. The image or camera frame is passed to the AI model.  
4. The predicted waste category and confidence score are displayed.  
5. All inference is performed locally in the user's browser.

---

## Installation and Usage
```bash
npm install
npm run dev
