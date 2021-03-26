import { config } from '@/services/config.service';
import { Message } from 'discord.js';
import { PermissionsLevel } from '@/services/permissions.service';

export type TriggerCriteria = string | RegExp | ((message: Message, keyword: string, args: string[]) => string | null);

export interface ConcreteTrigger {
    command: Command,
    criteria: TriggerCriteria,
    args: string[],
    type: 'string' | 'function' | 'regexp',
    activations: { text: string, index: number }[]
}

export abstract class Command {
    abstract name: string;
    abstract description: string;
    abstract triggerCriteria: TriggerCriteria[];
    requiredPerms: PermissionsLevel = PermissionsLevel.USER;

    abstract validate(message: Message, trigger: ConcreteTrigger): boolean;
    abstract execute(message: Message, trigger: ConcreteTrigger): void;

    checkTriggers(message: Message): ConcreteTrigger | null {
        const trigger: Partial<ConcreteTrigger> = {
            command: this
        };
        
        trigger.args = message.content.split(/ +/g);

        for (const criteria of this.triggerCriteria) {
            if (typeof criteria === 'function') {
                const res: string | null = criteria(message, trigger.args.shift()?.toLowerCase() || "", trigger.args);
                if (!res || res.length < 1) continue;
                trigger.type = 'function';
                trigger.activations = [{ text: res, index: -1 }];
            }
            if (criteria instanceof RegExp) {
                const res: RegExpMatchArray[] = Array.from(message.content.matchAll(criteria));
                if (res.length < 1) continue;
                trigger.type = 'regexp';
                trigger.activations = res.map((m: RegExpMatchArray) => ({
                    text: m[0] ?? message.content,
                    index: m.index ?? -1
                }));
            }
            if (typeof criteria === 'string') {
                if (message.content.indexOf(config.botConfig.prefix)) continue;
                const keyword: string = trigger.args.shift()?.toLowerCase().slice(config.botConfig.prefix.length) || 'default';

                if (criteria !== keyword) continue;
                trigger.type = 'string';
                trigger.activations = [{text: keyword, index: 0}];
            }
            trigger.criteria = criteria;
            return <ConcreteTrigger>trigger;
        }
        return null;
    }
}
