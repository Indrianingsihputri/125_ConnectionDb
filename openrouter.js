import express from 'express';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error('CRITICAL: OPENROUTER_API_KEY is not defined in .env');
    process.exit(1);
}