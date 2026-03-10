import { PermissionsBitField } from 'discord.js';
import { deleteRole } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'unlink',
  async execute(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const emoji = args[0];
    if (!emoji) return message.reply(await t(gid, 'unlink.usage'));

    const deleted = await deleteRole(gid, emoji);
    if (!deleted) {
      return message.reply(await t(gid, 'unlink.not_found'));
    }

    return message.reply(await t(gid, 'unlink.success', { emoji }));
  },
};

export default command;
