import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder, Client, SendableChannels } from 'discord.js';
import { loadRoles } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

async function run(gid: string, channel: SendableChannels) {
  const roles = await loadRoles(gid);
  const emojis = Object.keys(roles);

  if (emojis.length === 0) {
    return { error: await t(gid, 'panel.no_roles') };
  }

  let text = await t(gid, 'panel.header');
  for (const emoji of emojis) {
    text += `${emoji} ➔ <@&${roles[emoji]}>\n`;
  }

  const panel = await channel.send(text);

  for (const emoji of emojis) {
    let reaction = emoji;
    const match = emoji.match(/<a?:.+:(\d+)>/);
    if (match) reaction = match[1];
    await panel.react(reaction).catch((err: unknown) => console.log('Error reacting:', err));
  }

  return { error: null };
}

const command: BotCommand = {
  name: 'panel',
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Generate the reaction role selection panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const gid = interaction.guildId!;
    if (!interaction.channel?.isSendable()) return;
    const result = await run(gid, interaction.channel);

    if (result.error) {
      return interaction.reply(result.error);
    }
    await interaction.reply({ content: await t(gid, 'panel.created'), ephemeral: true });
  },

  async executePrefix(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    if (!message.channel.isSendable()) return;

    const result = await run(gid, message.channel);
    if (result.error) {
      return message.reply(result.error);
    }
  },
};

export default command;
