import { PermissionsBitField, EmbedBuilder, Client, Message, ColorResolvable } from 'discord.js';
import { loadWelcome, saveWelcome, resetWelcome } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand, WelcomeData } from '../types';

type SubcommandFn = (message: Message, args: string[], config: WelcomeData, client: Client, gid: string) => Promise<unknown>;

const subcommands: Record<string, SubcommandFn> = {
  async channel(message, args, config, client, gid) {
    const mentioned = message.mentions.channels.first();
    if (!mentioned) return message.reply(await t(gid, 'welcome.channel_usage'));

    config.channel = mentioned.id;
    await saveWelcome(gid, config);
    return message.reply(await t(gid, 'welcome.channel_success', { channel: mentioned.toString() }));
  },

  async message(message, args, config, client, gid) {
    const text = args.join(' ');
    if (!text) return message.reply(await t(gid, 'welcome.message_usage'));

    config.message = text;
    await saveWelcome(gid, config);
    return message.reply(await t(gid, 'welcome.message_success'));
  },

  async image(message, args, config, client, gid) {
    const url = args[0];
    if (!url || !url.startsWith('http')) return message.reply(await t(gid, 'welcome.image_usage'));

    config.image = url;
    await saveWelcome(gid, config);
    return message.reply(await t(gid, 'welcome.image_success'));
  },

  async color(message, args, config, client, gid) {
    const hex = args[0];
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hex || !hexRegex.test(hex)) return message.reply(await t(gid, 'welcome.color_usage'));

    config.color = hex;
    await saveWelcome(gid, config);
    return message.reply(await t(gid, 'welcome.color_success', { color: hex }));
  },

  async test(message, args, config, client, gid) {
    if (!config.channel) return message.reply(await t(gid, 'welcome.test_no_channel'));

    client.emit('guildMemberAdd', message.member!);
    return message.reply(await t(gid, 'welcome.test_success'));
  },

  async view(message, args, config, client, gid) {
    const notSet = await t(gid, 'welcome.view_not_set');
    const channel = config.channel ? `<#${config.channel}>` : notSet;
    const msg = config.message || await t(gid, 'welcome.view_default_message');
    const color = config.color || '#ffcc00';
    const image = config.image || notSet;

    const embed = new EmbedBuilder()
      .setColor(color as ColorResolvable)
      .setTitle(await t(gid, 'welcome.view_title'))
      .addFields(
        { name: await t(gid, 'welcome.view_field_channel'), value: channel, inline: true },
        { name: await t(gid, 'welcome.view_field_color'), value: color, inline: true },
        { name: await t(gid, 'welcome.view_field_message'), value: msg },
        { name: await t(gid, 'welcome.view_field_image'), value: image },
      );

    return message.reply({ embeds: [embed] });
  },

  async reset(message, args, config, client, gid) {
    await resetWelcome(gid);
    return message.reply(await t(gid, 'welcome.reset_success'));
  },
};

const validSubs = Object.keys(subcommands).map((s) => `\`${s}\``).join(', ');

const command: BotCommand = {
  name: 'welcome',
  async execute(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const sub = args.shift()?.toLowerCase();

    if (!sub || !subcommands[sub]) {
      return message.reply(await t(gid, 'welcome.subcommand_required', { options: validSubs }));
    }

    const config = await loadWelcome(gid);
    return subcommands[sub](message, args, config, client, gid);
  },
};

export default command;
