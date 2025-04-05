export const getEnvVar = (key: string) => {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
  return process.env[key]!;
};
