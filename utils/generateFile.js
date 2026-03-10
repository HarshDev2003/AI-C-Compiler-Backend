const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const os = require('os');

const dirCodes = os.tmpdir();

const generateFile = async (code) => {
    const fileId = randomUUID();
    const filename = `${fileId}.c`;
    const filePath = path.join(dirCodes, filename);

    await fs.promises.writeFile(filePath, code);
    return filePath;
};

module.exports = {
    generateFile,
};
