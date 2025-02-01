import { ICurrencyFormatter } from './ICurrencyFormatter';
import { IStringFormatter } from './IStringFormatter';

function getDivisor(currency:string):number {
    // TODO: Some currencies are in cents (USD) others are in whole units (JPY)
    return 100.0;
}

function getDecimalPlaces(currency:string):number {
    return 2;
}

export default class CurrencyFormatter implements ICurrencyFormatter {
    private _stringFormatter: IStringFormatter;

    constructor(stringFormatter:IStringFormatter) {
        this._stringFormatter = stringFormatter;
    }

    // the smallest denomination of the currency indicated by currency. For example, when currency is USD, amount is in cents.
    format(amount:number, currency:string = 'USD'):string {
        return this._stringFormatter.formatNumber(amount / getDivisor(currency), {
            style: 'currency',
            currency: currency || 'USD',
            currencyDisplay: 'symbol'
        });
    };

    formatInput(amount:number, currency:string = 'USD'):string {
        return this._stringFormatter.formatNumber(amount / getDivisor(currency), {
            useGrouping: false,
            minimumFractionDigits: getDecimalPlaces(currency),
            maximumFractionDigits: getDecimalPlaces(currency)
        });
    }

    parseInput(text:string, currency:string = 'USD'):number {
        // users enter values in more familiar formats. 
        // Ex: In USD users enter 1.23 but we work in whole cents so we convert it to 123
        const num:number = new Number(text).valueOf();
        return Math.floor(num * getDivisor(currency));
    }
}