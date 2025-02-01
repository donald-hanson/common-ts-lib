export interface ICurrencyFormatter {
    format(amount:number, currency:string):string;
    formatInput(amount:number, currency:string):string;
    parseInput(text:string, currency:string):number;
}