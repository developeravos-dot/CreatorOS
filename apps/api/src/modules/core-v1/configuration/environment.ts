export type CreatorOsEnvironment = {
  nodeEnv: string;
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  adminUsername: string;
  adminPassword: string;
};

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadEnvironment(): CreatorOsEnvironment {
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port,
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    adminUsername: required('CREATOROS_ADMIN_USERNAME'),
    adminPassword: required('CREATOROS_ADMIN_PASSWORD'),
  };
}