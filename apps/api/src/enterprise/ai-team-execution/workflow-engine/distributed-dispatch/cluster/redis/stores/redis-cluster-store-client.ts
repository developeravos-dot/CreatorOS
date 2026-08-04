export interface RedisClusterStoreClient {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    ...arguments_: Array<string | number>
  ): Promise<string | null>;
  del(...keys: string[]): Promise<number>;
  exists(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  mget(...keys: string[]): Promise<Array<string | null>>;
  scan(
    cursor: string,
    ...arguments_: Array<string | number>
  ): Promise<[string, string[]]>;
}
