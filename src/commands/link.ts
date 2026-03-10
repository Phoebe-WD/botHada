import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { saveRole } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'link',
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link an emoji to a role for reaction roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt.setName('emoji').setDescription('The emoji to link').setRequired(true))
    .addRoleOption(opt => opt.setName('role').setDescription('The role to assign').setRequired(true)),

  async execute(interaction, client) {
    const gid = interaction.guildId!;
    const emoji = interaction.options.getString('emoji', true);
    const role = interaction.options.getRole('role', true);

    await saveRole(gid, emoji, role.id);
    await interaction.reply(await t(gid, 'link.success', { emoji, role: role.name }));
  },

  async executePrefix(message, args, client) {
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
