import { PermissionsBitField } from 'discord.js';
import { loadRoles } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'panel',
  async execute(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const roles = await loadRoles(gid);
    const emojis = Object.keys(roles);

    if (emojis.length === 0) {
      return message.reply(await t(gid, 'panel.no_roles'));
    }

    let text = await t(gid, 'panel.header');
    for (const emoji of emojis) {
      text += `${emoji} ➔ <@&${roles[emoji]}>\n`;
    }

    if (!message.channel.isSendable()) return;
    const panel = await message.channel.send(text);

    for (const emoji of emojis) {
      let reaction = emoji;
      const match = emoji.match(/<a?:.+:(\d+)>/);
      if (match) reaction = match[1];

      await panel.react(reaction).catch((err: unknown) => console.log('Error reacting:', err));
    }
  },
};

export default command;
