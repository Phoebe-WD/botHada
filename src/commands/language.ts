import { PermissionsBitField } from 'discord.js';
import { setGuildLanguage } from '../utils/config';
import { t, supportedLangs } from '../utils/i18n';
import { BotCommand, SupportedLang } from '../types';

const command: BotCommand = {
  name: 'language',
  aliases: ['lang'],
  async execute(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const lang = args[0]?.toLowerCase();

    if (!lang) return message.reply(await t(gid, 'language.usage'));

    if (!supportedLangs.includes(lang as SupportedLang)) {
      return message.reply(await t(gid, 'language.invalid'));
    }

    await setGuildLanguage(gid, lang);

    // Respond in the NEW language
    return message.reply(await t(gid, 'language.success'));
  },
};

export default command;
