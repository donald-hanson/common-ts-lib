import { DateTime, Duration, DurationUnit } from "luxon";
import { TranslationOptions } from "./useTranslation";

export const useDateTime = () => {
    return {
        formatDuration: (duration:Duration, t: (key:string, options?:TranslationOptions) => string):string => {
            const durationParts = duration.toObject();
            const seconds = Math.round(durationParts.seconds ?? 0);
            const minutes = Math.round(durationParts.minutes ?? 0);
            const hours = Math.round(durationParts.hours ?? 0);
            const days = Math.round(durationParts.days ?? 0);
            
            let parts:string[] = [];
        
            const daysLabel = t("duration.days", { count: days });
            const hoursLabel = t("duration.hours", { count: hours });
            const minutesLabel = t("duration.minutes", { count: minutes });
            const secondsLabel = t("duration.seconds", { count: seconds });
        
            if (days > 0) {
                parts.push(daysLabel);
                if (hours > 0) {
                    parts.push(hoursLabel);
                }
            } else if (hours > 0) {
                parts.push(hoursLabel);
                if (minutes > 0) {
                    parts.push(minutesLabel);
                }
            } else if (minutes > 0) {
                parts.push(minutesLabel);
            } else {
                parts.push(secondsLabel);
            }
        
            parts = parts.filter((v, i, a) => !!v);
        
            if (parts.length == 0) {
                return t("duration.empty");
            }
        
            return parts.join(', ');
        },
        getRoundedWaitTime: (dateTime:DateTime):Duration => {
            const waitTimeMilliseconds = dateTime.diffNow().as('milliseconds');

            // round up to the nearest minute so we don't end up showing 14.98 minutes
            const roundedWaitTimeMilliseconds = waitTimeMilliseconds + (60000 - (waitTimeMilliseconds % 60000));
        
            let shifts:DurationUnit[] = [];	
            if (roundedWaitTimeMilliseconds >= 86400000) {
                // when > 1 day, shows X days, Y hours
                shifts = ['days', 'hours'];
            }
            else if (roundedWaitTimeMilliseconds >= 3600000) {
                // when > 1 hour, shows X hours, Y minutes
                shifts = ['hours', 'minutes'];
            } else {
                // show X minutes
                shifts = ['minutes'];
            }
        
            const waitTimeDuration = Duration.fromMillis(roundedWaitTimeMilliseconds).shiftTo(...shifts);            

            return waitTimeDuration;
        }
    }
}