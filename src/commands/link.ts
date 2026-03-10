import { PermissionsBitField } from 'discord.js';
import { saveRole } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'link',
  async execute(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const emoji = args[0];
    const mentionedRole = message.mentions.roles.first();

    if (!emoji || !mentionedRole) {
      return message.reply(await t(gid, 'link.usage'));
    }

    await saveRole(gid, emoji, mentionedRole.id);

    return message.reply(await t(gid, 'link.success', { emoji, role: mentionedRole.name }));
  },
};

export default command;
