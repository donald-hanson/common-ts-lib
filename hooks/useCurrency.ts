import { Internationalization } from "../i18n";

export const useCurrency = () => {
    return {
        c: (amount:number, currency:string = 'USD'):string => {
            return Internationalization.currency.format(amount, currency);
        },
        parseInput: (text:string, currency:string = 'USD'):number => {
            return Internationalization.currency.parseInput(text, currency);
        },
        formatInput: (amount:number, currency:string = 'USD'):string => {
            return Internationalization.currency.formatInput(amount, currency);
        }
    };
}
