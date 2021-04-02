import { Message } from "discord.js";

import { commands } from "@/commands";
import { config } from "@/services/config.service";
import { ConcreteTrigger } from "@/commands/command";

test('Sudo Command Trigger', () => {
    const msgA: Message = <Message> {content: `${config.botConfig.prefix}sudo`};
    const msgB: Message = <Message> {content: `${config.botConfig.prefix}sudosNotWorking`};
    const msgC: Message = <Message> {content: `${config.botConfig.prefix}sudo ping`};
    let trigger: ConcreteTrigger | null = null;

    // Alpha
    commands.forEach(command => {
        trigger = command.checkTriggers(msgA, msgA.content.split(/ +/g)) || trigger;
    });
    expect(trigger).toBeDefined();
    let trig = <ConcreteTrigger> <unknown> trigger;
    expect(trig.command.name).toBe('sudo');
    expect(trig.activations[0].text).toBe('sudo');

    // Beta
    trigger = null;
    commands.forEach(command => {
        trigger = command.checkTriggers(msgB, msgB.content.split(/ +/g)) || trigger;
    });
    expect(trigger).toBeNull();

    // Gamma
    trigger = null;
    commands.forEach(command => {
        trigger = command.checkTriggers(msgC, msgC.content.split(/ +/g)) || trigger;
    });
    expect(trigger).toBeDefined();
    trig = <ConcreteTrigger> <unknown> trigger;
    expect(trig.command.name).toBe('ping');
    expect(trig.activations[0].text).toBe('sudo>ping');
});