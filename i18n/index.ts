import { TranslateOptions } from 'i18n-js';
import {FormatNumberOptions} from 'react-intl';
import { ICurrencyFormatter } from './ICurrencyFormatter';
import { IStringFormatter } from './IStringFormatter';
import CurrencyFormatter from './CurrencyFormatter';
import StringFormatter from './StringFormatter';

const stringFormatter:IStringFormatter = new StringFormatter();

stringFormatter.setLanguage('en-US');

export class Internationalization {
  static currency:ICurrencyFormatter = new CurrencyFormatter(stringFormatter);

  static initialize(translations: { [locale: string]: object }) {
    stringFormatter.initialize(translations);
  }

  static setLanguage(language:string) {
    return stringFormatter.setLanguage(language);
  }

  static strings(name:string, params:TranslateOptions = {}) {
    return stringFormatter.strings(name, params);
  }

  static formatNumber(value:number|bigint, options:FormatNumberOptions = {}) {
    return stringFormatter.formatNumber(value, options);
  }

  static getCurrentLanguageCode() {
    return stringFormatter.getCurrentLanguageCode();
  }
}