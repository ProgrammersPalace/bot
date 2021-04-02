import { Message } from "discord.js";

import { commands } from "@/commands";
import { config } from "@/services/config.service";
import { ConcreteTrigger } from "@/commands/command";

test('Help Command Trigger', () => {
    const msgA: Message = <Message> {content: `${config.botConfig.prefix}help`};
    const msgB: Message = <Message> {content: `${config.botConfig.prefix}helpsNotWorking`};
    let trigger: ConcreteTrigger | null = null;

    // Alpha
    commands.forEach(command => {
        trigger = command.checkTriggers(msgA, msgA.content.split(/ +/g)) || trigger;
    });
    expect(trigger).toBeDefined();
    let trig = <ConcreteTrigger> <unknown> trigger;
    expect(trig.command.name).toBe('help');
    expect(trig.activations[0].text).toBe('help');

    // Beta
    trigger = null;
    commands.forEach(command => {
        trigger = command.checkTriggers(msgB, msgB.content.split(/ +/g)) || trigger;
    });

    expect(trigger).toBeNull();
})