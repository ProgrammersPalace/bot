import { Message, MessageEmbed } from 'discord.js';
import { ConcreteTrigger, Command, TriggerCriteria } from './command';
import { PermissionsLevel } from '@/services/permissions.service';
import * as dayjs from 'dayjs';

export class WhoIsCommand extends Command {
    name = 'whois';
    description = 'A command that checks who a person is!';
    syntax = '`whois [ping]`';
    requiredPerms = PermissionsLevel.EVERYONE;

    triggerCriteria: TriggerCriteria[] = [
        this.name
    ];

    constructor() {
        super();
        this.subCommands.push({
            name: 'image',
            description: 'SubCommand: Image',
            syntax: '-',
            triggerCriteria: [ '--image' ],
            subCommands: [],
            requiredPerms: PermissionsLevel.USER,
            validate: (message: Message, trigger: ConcreteTrigger) => true,
            execute: (message: Message, trigger: ConcreteTrigger) => {
                if(message.mentions && message.mentions.users.size === 1) {
                    let user = message.mentions.users!.first()!;
                    message.channel.send(user.avatarURL() || user.defaultAvatarURL);
                }
            },
            checkTriggers: this.checkTriggers
        });
    }

    validate = () => true;
    public execute(message: Message, trigger: ConcreteTrigger) {
        if(message.mentions && message.mentions.users.size === 1) {
            let user = message.mentions.members!.first()!;

            const embed: MessageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`whois: ${user.nickname || user.user.username}`)
                .setThumbnail(user.user.avatarURL() || 'https://www.pngitem.com/pimgs/m/75-757027_price-tag-vector-price-tag-clip-art-hd.png')
                .addFields(
                    { name: 'Nickname', value: `${user.nickname || user.user.username}@${user.guild}` },
                    { name: 'Tag', value: `${user.user.tag}` },
                    { name: 'Profile Picture Link', value: user.user.avatarURL() || user.user.defaultAvatarURL },
                    { name: 'Created At', value: `${dayjs(user.user.createdAt).format('DD/MM/YYYY')}` }, 
                    { name: 'Requested by', value: message.author.tag }
                );
    
            message.channel.send(embed);
        }
    }
}
