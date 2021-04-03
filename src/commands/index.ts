import { Command } from './command';
import { PingCommand } from './ping.command';
import { HelpCommand } from './help.command';
import { DefaultCommand } from '@/commands/default.command';
import { SudoCommand } from './sudo.command';
import { WhoIsCommand } from './whois.command';

const defaultCommand = new DefaultCommand();

const commands: Command[] = [
    defaultCommand,
    new PingCommand(),
    new SudoCommand(),
    new WhoIsCommand()
];

// Needs to happen after `commands`
// initialization to register existing
// commands!
commands.push(new HelpCommand());

export {
    commands,
    defaultCommand,
    PingCommand,
    SudoCommand,
    WhoIsCommand,
    HelpCommand,
    DefaultCommand
}
