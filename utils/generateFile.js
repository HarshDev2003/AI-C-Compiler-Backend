const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const dirCodes = path.join(__dirname, '..', 'codes');
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

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
