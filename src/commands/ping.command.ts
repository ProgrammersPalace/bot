import { Message } from 'discord.js';
import { ConcreteTrigger, Command, TriggerCriteria } from './command';
import { PermissionsLevel } from '@/services/permissions.service';

export class PingCommand extends Command {
    name = 'ping';
    description = 'A simple debug command!';
    requiredPerms = PermissionsLevel.EVERYONE;

    triggerCriteria: TriggerCriteria[] = [
        this.name
    ];

    validate = () => true;
    public execute(message: Message, trigger: ConcreteTrigger) {
        message.channel.send('Pong!');
    }
}
