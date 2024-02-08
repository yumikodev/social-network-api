export interface JwtConfig {
  ACCESS_SECRET: string;
  ACCESS_EXPIRE: number;
}

export default () => ({
  JWT: {
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    ACCESS_EXPIRE: 60 * 60,
  } as JwtConfig,
});
