const headerMap = {
    printf: '<stdio.h>',
    scanf: '<stdio.h>',
    sqrt: '<math.h>',
    strlen: '<string.h>',
    strcmp: '<string.h>',
    strcpy: '<string.h>',
    malloc: '<stdlib.h>',
    free: '<stdlib.h>',
    exit: '<stdlib.h>',
    rand: '<stdlib.h>',
};

const injectHeaders = (code) => {
    let injectedCode = code;
    const headersToAdd = new Set();

    // Find missing headers
    for (const [func, header] of Object.entries(headerMap)) {
        // Basic regex matched if function is used and header not already included
        const funcRegex = new RegExp(`\\b${func}\\s*\\(`, 'g');
        if (funcRegex.test(code)) {
            if (!code.includes(header)) {
                headersToAdd.add(header);
            }
        }
    }

    // Inject headers at the top
    if (headersToAdd.size > 0) {
        const headersString = Array.from(headersToAdd).map(h => `#include ${h}`).join('\n');
        injectedCode = `${headersString}\n\n${code}`;
    }

    return injectedCode;
};

module.exports = {
    injectHeaders,
};
