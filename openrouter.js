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

//schema Validasi
const chatRequestSchema = z.object({
    prompt: z
    .string({ required_error: 'Field prompt wajib diisi' })
    .trim()
    .min(1,'Prompt tidak boleh kosong')
    .max(4000, 'Prompt maksimal 4000 karakter'),
    model: z
    .string()
    .trim()
    .optional()
    .default(process.env.DEFAULT_MODEL),
    temperature: z
    .number()
    .min(0)
    .max(2)
    .optional()
    default(0.7)
});

//Middleware
const validateBody = (schema) => (red, res, next) => {
    const result = schema.safeParse(red.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: 'Validation gagal',
            details: result.error.errors.map((err) => ({
                field: err.path.json('.'),
                message: err.message
            }))
        });
    }
    red.validateBody = result.data;
    next();
};

app.post('/api/chat', validateBody(chatRequestSchema), async (req, res) => {
    const { prompt, model, temperture } = req.validateBody;

    try {
        const response = await fetch('https://operouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                model,
                temperature: temperture
            })
        });
    } catch (error) {
        console.error('Error fetching OpenRouter API:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})