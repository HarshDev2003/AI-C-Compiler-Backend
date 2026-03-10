const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const outputPath = os.tmpdir();

const executeCode = (filePath, input) => {
    const fileId = path.basename(filePath).split('.')[0];
    const outPath = path.join(outputPath, `${fileId}.exe`);

    return new Promise((resolve, reject) => {
        // 1. Compile
        exec(`gcc "${filePath}" -o "${outPath}"`, (error, stdout, stderr) => {
            // Compilation error
            if (error || stderr) {
                return reject({ type: 'compile', error: error ? error.message : stderr });
            }

            // 2. Execute
            let runCommand = `"${outPath}"`;
            if (input && input.trim() !== '') {
                // Create a temporary input file to feed to the executable
                const inputFilePath = path.join(outputPath, `${fileId}_input.txt`);
                fs.writeFileSync(inputFilePath, input);
                runCommand = `"${outPath}" < "${inputFilePath}"`;
            }

            // We'll wrap execution with cross-platform timeout or use exec timeout
            exec(runCommand, { timeout: 3000 }, (runError, runStdout, runStderr) => {
                // Cleanup executable and input file
                if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
                if (input && input.trim() !== '') {
                    const inputFilePath = path.join(outputPath, `${fileId}_input.txt`);
                    if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
                }

                if (runError) {
                    return reject({ type: 'runtime', error: runStderr || runError.message || 'Execution Error / Timeout' });
                }

                resolve(runStdout);
            });
        });
    });
};

module.exports = {
    executeCode,
};
