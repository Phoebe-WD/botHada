import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder, ChannelType } from 'discord.js';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

async function run(guild: import('discord.js').Guild) {
  const gid = guild.id;

  const rolesToCreate = ['reventHADAS', 'abandonHADA', 'desquiciHADA', 'traumHADA'];
  for (const roleName of rolesToCreate) {
    const exists = guild.roles.cache.find((role) => role.name === roleName);
    if (!exists) {
      await guild.roles.create({ name: roleName, color: 'Random' });
      console.log(`Role ${roleName} created.`);
    }
  }

  const voiceChannels = ['CASUALES COD', 'COMPETITIVO COD', 'VALORANT', 'VALORANT 2'];
  for (const channelName of voiceChannels) {
    const exists = guild.channels.cache.find(
      (c) => c.name === channelName && c.type === ChannelType.GuildVoice,
    );
    if (!exists) {
      await guild.channels.create({ name: channelName, type: ChannelType.GuildVoice });
      console.log(`Voice channel ${channelName} created.`);
    }
  }

  return await t(gid, 'setup.success');
}

const command: BotCommand = {
  name: 'setup',
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Create predefined roles and voice channels')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    await interaction.deferReply();
    const result = await run(interaction.guild!);
    await interaction.editReply(result);
  },

  async executePrefix(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(await t(message.guild!.id, 'common.no_permissions'));
    }
    const result = await run(message.guild!);
    await message.reply(result);
  },
};

export default command;
