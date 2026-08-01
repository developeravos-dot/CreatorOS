export {};

declare global {
  interface Window {
    creatorOS: {
      api(
        endpoint: string,
        method?: string,
        body?: unknown,
      ): Promise<unknown>;
      environment(): Promise<{
        apiBase: string;
        platform: string;
        version: string;
      }>;
      openExternal(
        url: string,
      ): Promise<boolean>;
    };
  }
}