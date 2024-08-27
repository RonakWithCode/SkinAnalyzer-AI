import express from 'express';
import { uploadImage, analyzeImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', uploadImage);
router.post('/analyze', analyzeImage);

export default router;
