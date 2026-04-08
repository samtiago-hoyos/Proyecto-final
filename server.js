const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GOOGLE_API_KEY?.trim();
const modelName = process.env.GENAI_MODEL?.trim() || 'text-bison-001';

if (!apiKey) {
    console.warn('⚠️ GOOGLE_API_KEY no está configurada. Crea un archivo .env con la clave o define la variable de entorno.');
}

console.log(`Usando modelo: ${modelName}`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'TRUSTREVIEW_FIXED')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', model: modelName });
});

app.post('/api/gemini', async (req, res) => {
    try {
        const prompt = String(req.body.prompt || '').trim();
        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido.' });
        }
        if (!apiKey) {
            return res.status(500).json({ error: 'Falta GOOGLE_API_KEY en el servidor.' });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(modelName)}:generateText?key=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: { text: prompt },
                temperature: 0.7,
                maxOutputTokens: 220,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'Error al llamar a Gemini.' });
        }

        const answer = data?.candidates?.[0]?.content || 'No se recibió respuesta de Gemini.';
        res.json({ answer });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Falla interna al comunicarse con Gemini.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
    console.log('Sirviendo archivos desde TRUSTREVIEW_FIXED');
});
