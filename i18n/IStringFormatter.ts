import { TranslateOptions } from 'i18n-js';
import { FormatNumberOptions} from 'react-intl';

export interface IStringFormatter {
    setLanguage(language:string): void;
    initialize(translations: { [locale: string]: object }) : void;
    strings(name:string, params:TranslateOptions):string;
    formatNumber(value:number|bigint, options:FormatNumberOptions) :string;
    getCurrentLanguageCode():string;
}