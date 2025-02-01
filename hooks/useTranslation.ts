import { Internationalization } from "../i18n";

export type UseTranslationOptions = {
    ns:string
}

export type DynamicTranslationValues = {
    [key: string]: string|number;
}

export type TranslationOptions = {
    ns?:string
} & DynamicTranslationValues;

export const useTranslation = (rootOptions?:UseTranslationOptions) => {
    return {
        t: (key:string, options?:TranslationOptions):string => {
            let ns = options?.ns ?? rootOptions?.ns ?? null;
            let fullKey = key;
            if (ns) {
                fullKey = ns + '.' + key;
            }
            return Internationalization.strings(fullKey, {...options});
        }
    };
}
