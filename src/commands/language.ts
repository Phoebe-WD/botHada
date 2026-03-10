import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { setGuildLanguage } from '../utils/config';
import { t, supportedLangs } from '../utils/i18n';
import { BotCommand, SupportedLang } from '../types';

const command: BotCommand = {
  name: 'language',
  aliases: ['lang'],
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the bot language for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt
      .setName('lang')
      .setDescription('Language code')
      .setRequired(true)
      .addChoices(
        { name: 'Español', value: 'es' },
        { name: 'English', value: 'en' },
      )),

  async execute(interaction, client) {
    const gid = interaction.guildId!;
    const lang = interaction.options.getString('lang', true);
    await setGuildLanguage(gid, lang);
    await interaction.reply(await t(gid, 'language.success'));
  },

  async executePrefix(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const lang = args[0]?.toLowerCase();

    if (!lang) return message.reply(await t(gid, 'language.usage'));

    if (!supportedLangs.includes(lang as SupportedLang)) {
      return message.reply(await t(gid, 'language.invalid'));
    }

    await setGuildLanguage(gid, lang);
    return message.reply(await t(gid, 'language.success'));
  },
};

export default command;
