export function getConfig() {
  return {
    TIMESTAMP: process.env.TIMESTAMP === 'true',
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    LOGGING: Boolean(process.env.LOGGING),
    FILENAME: process.env.FILENAME || './log-entries.csv',
  };
}
