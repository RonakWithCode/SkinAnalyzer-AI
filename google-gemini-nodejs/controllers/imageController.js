import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  geminiConfig,
});

export const uploadImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    // Save the image to the server (optional, if you want to store the uploaded images)
    const filePath = `./uploads/uploaded_image_${Date.now()}.jpg`;
    await fs.writeFile(filePath, imageBase64, { encoding: 'base64' });

    res.status(200).json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

export const analyzeImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const promptConfig = [
      {
        text: `Please provide a detailed JSON object about the skin condition called "Acne Vulgaris". The JSON should include:
              1. "Name": The name of the condition.
              2. "Description": A detailed explanation of the condition.
              3. "Causes": A list of possible causes.
              4. "Symptoms": Common symptoms associated with the condition.
              5. "HomeRemedies": Suggested home remedies with instructions.`
      },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
    ];

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: promptConfig }],
    });

    const response = await result.response;
    console.log(response.text())
    res.status(200).json({ analysis: response.text() });
  } catch (error) {
    res.status(500).json({ message: 'Analysis failed', error });
  }
};
