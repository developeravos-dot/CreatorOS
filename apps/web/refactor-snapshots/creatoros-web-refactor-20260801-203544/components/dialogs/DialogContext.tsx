import { createContext } from "react";

export interface DialogContextValue {

    open() : void;

    close() : void;

}

export const DialogContext =
    createContext<DialogContextValue | null>(null);

