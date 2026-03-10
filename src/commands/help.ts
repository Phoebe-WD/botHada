import { EmbedBuilder } from 'discord.js';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'help',
  aliases: ['info'],
  async execute(message, args, client) {
    const gid = message.guild!.id;

    const embed = new EmbedBuilder()
      .setColor('#00b0f4')
      .setTitle(await t(gid, 'help.title'))
      .setDescription(await t(gid, 'help.description'))
      .addFields(
        { name: await t(gid, 'help.general_title'), value: await t(gid, 'help.general_value') },
        { name: await t(gid, 'help.roles_title'), value: await t(gid, 'help.roles_value') },
        { name: await t(gid, 'help.welcome_title'), value: await t(gid, 'help.welcome_value') },
      )
      .setFooter({
        text: await t(gid, 'help.footer'),
        iconURL: client.user!.displayAvatarURL(),
      });

    return message.reply({ embeds: [embed] });
  },
};

export default command;
