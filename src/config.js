export function getConfig() {
  return {
    TIMESTAMP: Boolean(process.env.TIMESTAMP),
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    LOGGING: Boolean(process.env.LOGGING),
  };
}
