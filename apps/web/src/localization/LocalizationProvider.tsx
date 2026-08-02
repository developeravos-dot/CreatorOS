import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { ar } from "./ar";
import { en } from "./en";
import type {
    Locale,
    TranslationDictionary,
} from "./types";

type LocalizationContextValue = {

    locale: Locale;

    changeLanguage: (locale: Locale) => void;

    t: (key: string) => string;

};

const dictionaries: Record<
    Locale,
    TranslationDictionary
> = {

    ar,

    en,

};

const LocalizationContext =
createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({

    children,

}:{

    children: ReactNode;

}){

    const [locale,setLocale] =
    useState<Locale>("ar");

    const value =
    useMemo<LocalizationContextValue>(()=>({

        locale,

        changeLanguage:setLocale,

        t:(key:string)=>
            dictionaries[locale][key] ?? key,

    }),[locale]);

    return(

        <LocalizationContext.Provider
            value={value}
        >

            {children}

        </LocalizationContext.Provider>

    );

}

export function useLocalization(){

    const context =
    useContext(LocalizationContext);

    if(!context){

        throw new Error(
            "LocalizationProvider is missing."
        );

    }

    return context;

}
