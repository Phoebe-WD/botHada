import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { deleteRole } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'unlink',
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Remove an emoji-role link')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt.setName('emoji').setDescription('The emoji to unlink').setRequired(true)),

  async execute(interaction, client) {
    const gid = interaction.guildId!;
    const emoji = interaction.options.getString('emoji', true);

    const deleted = await deleteRole(gid, emoji);
    if (!deleted) {
      return interaction.reply(await t(gid, 'unlink.not_found'));
    }
    await interaction.reply(await t(gid, 'unlink.success', { emoji }));
  },

  async executePrefix(message, args, client) {
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
