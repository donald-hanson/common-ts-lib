import { I18n, TranslateOptions } from 'i18n-js';
import { Settings } from 'luxon';
import {createIntl, createIntlCache, IntlCache, IntlShape, FormatNumberOptions} from 'react-intl';
import { IStringFormatter } from './IStringFormatter';

export default class StringFormatter implements IStringFormatter {
    
    private _i18n:I18n;
    private _intlCache:IntlCache;
    private _intl:IntlShape | undefined;
    private _languageLocale:string | undefined;

    constructor() {
        this._i18n = new I18n();

        // Should the app fallback to English if user locale doesn't exists
        this._i18n.enableFallback = true;
        this._i18n.defaultLocale = "en";
        this._i18n.missingBehavior = "message";

        this._intlCache = createIntlCache();
    }

    setLanguage(language:string) {
        const fullLocale = language;

        this._languageLocale = fullLocale.indexOf("-") >= 0 ? fullLocale.substr(0, fullLocale.indexOf("-")) : fullLocale;

        this._i18n.locale = fullLocale;
        
        Settings.defaultLocale = this._languageLocale;

        this._intl = createIntl({ locale: language, defaultLocale: 'en' }, this._intlCache);
    }

    initialize(translations: { [locale: string]: object }):void {
        this._i18n.translations = translations;
    }

    strings(name:string, params:TranslateOptions = {}):string {
        return this._i18n.t(name, params);
    }

    formatNumber(value:number|bigint, options:FormatNumberOptions = {}):string {
        return this._intl!.formatNumber(value, options);
    }

    getCurrentLanguageCode():string {
        return this._languageLocale!;
    }    
}