import {
  useEffect,
  useState,
} from "react";

export interface NetworkStatus {
  online: boolean;
  reconnected: boolean;
}

export function useNetworkStatus():
  NetworkStatus {
  const [
    online,
    setOnline,
  ] = useState(
    () => navigator.onLine,
  );

  const [
    reconnected,
    setReconnected,
  ] = useState(false);

  useEffect(() => {
    let reconnectTimeout:
      | number
      | undefined;

    const handleOnline =
      (): void => {
        setOnline(true);
        setReconnected(true);

        reconnectTimeout =
          window.setTimeout(
            () => {
              setReconnected(false);
            },
            4_000,
          );
      };

    const handleOffline =
      (): void => {
        setOnline(false);
        setReconnected(false);
      };

    window.addEventListener(
      "online",
      handleOnline,
    );

    window.addEventListener(
      "offline",
      handleOffline,
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline,
      );

      window.removeEventListener(
        "offline",
        handleOffline,
      );

      if (
        reconnectTimeout !==
        undefined
      ) {
        window.clearTimeout(
          reconnectTimeout,
        );
      }
    };
  }, []);

  return {
    online,
    reconnected,
  };
}
