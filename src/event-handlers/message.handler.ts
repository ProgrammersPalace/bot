import { Message } from 'discord.js';
import { IEventHandler } from './event-handler.interface';
import { config } from '@/services/config.service';
import { commands, defaultCommand } from '@/commands';
import { RateLimitService } from '@/services/rate-limit.service';
import { ConcreteTrigger, Command, TriggerCriteria } from '@/commands/command';
import { NullTrigger } from '@/commands/default.command';

export class MessageHandler implements IEventHandler<MessageHandler['EVENT_NAME']> {
    public readonly EVENT_NAME = 'message';

    private readonly commandRateLimiter = new RateLimitService();

    public onEvent(message: Message): void {
        if (message.author.bot) return;
        
        // TODO: add check for moderation commands -- should bypass rate limit
        if (this.commandRateLimiter.shouldReject(message.author))
            return void message.channel.send('You are sending too many messages!');

        const [command, trigger] = this.getTriggeredCommand(message) ?? [defaultCommand, NullTrigger];

        command.execute(message, trigger, trigger.args);
    }

    private getTriggeredCommand(message: Message): [Command, ConcreteTrigger] | undefined{
        for (const cmd of commands) {
            const trigger = cmd.checkTriggers(message);
            if (trigger)
                return [cmd, trigger];
        }
    }
}
