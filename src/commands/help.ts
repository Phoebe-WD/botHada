import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

async function buildEmbed(gid: string, avatarURL: string) {
  return new EmbedBuilder()
    .setColor('#8CA0D7')
    .setTitle(await t(gid, 'help.title'))
    .setDescription(await t(gid, 'help.description'))
    .addFields(
      { name: await t(gid, 'help.general_title'), value: await t(gid, 'help.general_value') },
      { name: await t(gid, 'help.roles_title'), value: await t(gid, 'help.roles_value') },
      { name: await t(gid, 'help.welcome_title'), value: await t(gid, 'help.welcome_value') },
    )
    .setFooter({
      text: await t(gid, 'help.footer'),
      iconURL: avatarURL,
    });
}

const command: BotCommand = {
  name: 'help',
  aliases: ['info'],
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show the bot help panel'),

  async execute(interaction, client) {
    const gid = interaction.guildId!;
    const embed = await buildEmbed(gid, client.user!.displayAvatarURL());
    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args, client) {
    const gid = message.guild!.id;
    const embed = await buildEmbed(gid, client.user!.displayAvatarURL());
    return message.reply({ embeds: [embed] });
  },
};

export default command;
