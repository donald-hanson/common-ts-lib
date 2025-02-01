import { parsePhoneNumber } from 'awesome-phonenumber'

export interface IValidationRule {
    input:string|undefined
	output:(errorMessage:string|null|undefined) => void
	rules:IValidationRuleDefinition[]
	stopOnError:boolean
}

export interface IValidationRuleDefinition {
    uid?:string
	rule: (text?:string, other?:string) => boolean;
	message?: string
	other?:string
}

export type ErrorMessageCallback = (rule:IValidationRuleDefinition) => string;

export const Validation = {
    rules: {
        email(text:string, other?:string): boolean {
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(text);
        },
    
        notEmpty(text:string, other?:string): boolean {
            return !(!text || 0 === text.length);
        },

        equalsOtherInput(text:string, other?:string):boolean {
            return text === other;
        },

        phoneNumber(text:string, other?:string):boolean {
            var pn = parsePhoneNumber(text, {
                regionCode: 'US'
            })
            return pn.valid;
        },

        number(text:string, other?:string):boolean {
            var number = new Number(text);
            
            if (Number.isNaN(number)) {
                return false;
            }

            if (isNaN(number.valueOf())) {
                return false;
            }

            return true;
        }
    },

    isValid(validationRules:IValidationRule[], errorMessageCallback?:ErrorMessageCallback) {       
        // reset the initial state to blank for all errors        
        validationRules.forEach(validationRule => {
            validationRule.output(null);
        })

        var anyErrors = false;

        // walk each entry
        for(var i=0;i<validationRules.length;i++) {
            var validationRule = validationRules[i];
            var input = validationRule.input;
            var rules = validationRule.rules;

            var errorMessage = null;
            // walk each rule in each entry
            for(var j=0;j<rules.length;j++) {
                var rule = rules[j];
                if (!rule.rule(input, rule.other)) {
                    if (errorMessageCallback) {
                        errorMessage = errorMessageCallback(rule);
                    } else {
                        errorMessage = rule.message;
                    }
                    break;
                }
            }

            // if there was an error write it in the state
            if (errorMessage) {
                anyErrors = true;
                validationRule.output(errorMessage);

                // stop if we are told to stop processing future entries
                if (validationRule.stopOnError) {
                    break;
                }
            }
        }

        if (anyErrors) {
            return false;
        }

        return true;
    }
}