const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });

const formatLog = (level, message, meta = {}) => {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
    }) + '\n';
};

const logger = {
    info: (msg, meta) => {
        const log = formatLog('INFO', msg, meta);
        accessLogStream.write(log);
        if (process.env.NODE_ENV !== 'production') console.log(`[INFO] ${msg}`);
    },
    warn: (msg, meta) => {
        const log = formatLog('WARN', msg, meta);
        accessLogStream.write(log);
        console.warn(`[WARN] ${msg}`);
    },
    error: (msg, meta) => {
        const log = formatLog('ERROR', msg, meta);
        errorLogStream.write(log);
        console.error(`[ERROR] ${msg}`);
    }
};

module.exports = logger;
