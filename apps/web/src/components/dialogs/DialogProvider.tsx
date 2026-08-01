import {
  useCallback,
  useMemo,
} from "react";

import type {
  PropsWithChildren,
} from "react";

import {
  DialogContext,
} from "./DialogContext";

export default function DialogProvider({
  children,
}: PropsWithChildren) {
  const open = useCallback(() => {
    // Reserved for global dialog operations.
  }, []);

  const close = useCallback(() => {
    // Reserved for global dialog operations.
  }, []);

  const value = useMemo(
    () => ({
      open,
      close,
    }),
    [open, close],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}
