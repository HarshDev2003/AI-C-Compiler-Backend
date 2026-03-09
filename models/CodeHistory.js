const mongoose = require('mongoose');

const codeHistorySchema = new mongoose.Schema({
    userPrompt: {
        type: String,
        default: '',
    },
    generatedCode: {
        type: String,
        required: true,
    },
    executionInput: {
        type: String,
        default: '',
    },
    executionOutput: {
        type: String,
        default: '',
    },
    executionError: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CodeHistory', codeHistorySchema);
