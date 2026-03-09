const { generateFile } = require('../utils/generateFile');
const { executeCode } = require('../utils/executeCode');
const { injectHeaders } = require('../utils/headerInjector');
const CodeHistory = require('../models/CodeHistory');
const fs = require('fs');

const compileCode = async (req, res) => {
    const { code, input, prompt } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: 'Empty code body!' });
    }

    // Check code size < 500KB
    if (Buffer.byteLength(code, 'utf8') > 500000) {
        return res.status(400).json({ success: false, error: 'Code size exceeds 500KB limit.' });
    }

    let filePath;
    try {
        // Inject headers automatically if missing
        const preparedCode = injectHeaders(code);

        // Generate C file
        filePath = await generateFile(preparedCode);

        // Compile and execute
        const output = await executeCode(filePath, input);

        // Save to MongoDB
        await CodeHistory.create({
            userPrompt: prompt || '',
            generatedCode: code,
            executionInput: input || '',
            executionOutput: output,
            executionError: '',
        });

        res.status(200).json({ success: true, output });
    } catch (err) {
        // Save error to MongoDB
        await CodeHistory.create({
            userPrompt: prompt || '',
            generatedCode: code,
            executionInput: input || '',
            executionOutput: '',
            executionError: err.error || err.message || 'Execution Error',
        });

        res.status(500).json({ success: false, error: err.error || err.message || 'Execution Error' });
    } finally {
        // Cleanup the generated .c file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

module.exports = {
    compileCode,
};
