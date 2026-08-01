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
    // Dialog state is handled by each operation dialog.
  }, []);

  const close = useCallback(() => {
    // Dialog state is handled by each operation dialog.
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
