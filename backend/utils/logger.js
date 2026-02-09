// utils/logger.js

const isProd = process.env.NODE_ENV === "production";

/**
 * Build structured log object
 */
const buildLog = (level, message, meta = {}) => {
  return {
    level,
    message,
    time: new Date().toISOString(),
    ...meta,
  };
};

/**
 * Pretty output for development
 */
const devFormat = (log) => {
  const { level, message, time, ...rest } = log;

  return `[${level}] ${time} → ${message} ${
    Object.keys(rest).length ? JSON.stringify(rest, null, 2) : ""
  }`;
};

/**
 * Output handler
 */
const output = (level, message, meta) => {
  const log = buildLog(level, message, meta);

  if (isProd) {
    // JSON logs for production (Cloud logging friendly)
    console.log(JSON.stringify(log));
    return;
  }

  // Pretty logs for development
  if (level === "ERROR") console.error(devFormat(log));
  else if (level === "WARN") console.warn(devFormat(log));
  else console.log(devFormat(log));
};

const logger = {
  info: (msg, meta = {}) => output("INFO", msg, meta),
  warn: (msg, meta = {}) => output("WARN", msg, meta),
  error: (msg, meta = {}) => output("ERROR", msg, meta),
  debug: (msg, meta = {}) => {
    if (!isProd) output("DEBUG", msg, meta);
  },
};

export default logger;
