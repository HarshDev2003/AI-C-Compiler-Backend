const { GoogleGenAI } = require('@google/genai');

const generateCode = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    try {
        const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(400).json({
                success: false,
                error: 'AI_API_KEY missing in .env. Please add it to use real AI.'
            });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const systemInstruction = `You are a C programming assistant for an online compiler. You must respond with ONLY VALID C CODE.
Do not include any markdown formatting like \`\`\`c or explanations.
1. Always include necessary headers.
2. Always write a valid main() function.
3. Code must be ready to compile with GCC.
4. CRITICAL: NEVER hardcode input values (e.g., int a = 5; or char str[] = "hello"). ALWAYS ask the user for input using scanf, fgets, or similar standard input functions. Assume the user will provide input through the 'Standard Input' console.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        let generatedC = response.text || '';

        // Strip out markdown code blocks if the model ignores the instruction
        if (generatedC.startsWith('```c') || generatedC.startsWith('```C')) {
            generatedC = generatedC.replace(/^```[cC]\n?/, '');
            if (generatedC.endsWith('```')) {
                generatedC = generatedC.substring(0, generatedC.lastIndexOf('```'));
            }
        } else if (generatedC.startsWith('```')) {
            generatedC = generatedC.replace(/^```\n?/, '');
            if (generatedC.endsWith('```')) {
                generatedC = generatedC.substring(0, generatedC.lastIndexOf('```'));
            }
        }

        res.status(200).json({ success: true, code: generatedC.trim() });
    } catch (err) {
        console.error('AI Generation Error:', err);
        res.status(500).json({ success: false, error: 'Failed to generate code via AI: ' + err.message });
    }
};

module.exports = {
    generateCode,
};
