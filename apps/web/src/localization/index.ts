import { ar } from "./ar";
import { en } from "./en";
import type { Locale } from "./types";

const dictionaries = {
  ar,
  en
};

let currentLocale: Locale = "ar";

export function setLocale(locale: Locale){

    currentLocale = locale;

}

export function getLocale(){

    return currentLocale;

}

export function t(key:string){

    return dictionaries[currentLocale][key] ?? key;

}
