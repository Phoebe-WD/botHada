import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, Client, Message, ChatInputCommandInteraction, ColorResolvable } from 'discord.js';
import { loadWelcome, saveWelcome, resetWelcome } from '../utils/config';
import { t } from '../utils/i18n';
import { BotCommand, WelcomeData } from '../types';

// ==========================================
// SHARED LOGIC
// ==========================================

type Reply = (content: string | { embeds: EmbedBuilder[] }) => Promise<unknown>;

async function handleChannel(gid: string, channelId: string, config: WelcomeData, reply: Reply) {
  config.channel = channelId;
  await saveWelcome(gid, config);
  return reply(await t(gid, 'welcome.channel_success', { channel: `<#${channelId}>` }));
}

async function handleMessage(gid: string, text: string, config: WelcomeData, reply: Reply) {
  config.message = text;
  await saveWelcome(gid, config);
  return reply(await t(gid, 'welcome.message_success'));
}

async function handleImage(gid: string, url: string, config: WelcomeData, reply: Reply) {
  config.image = url;
  await saveWelcome(gid, config);
  return reply(await t(gid, 'welcome.image_success'));
}

async function handleColor(gid: string, hex: string, config: WelcomeData, reply: Reply) {
  config.color = hex;
  await saveWelcome(gid, config);
  return reply(await t(gid, 'welcome.color_success', { color: hex }));
}

async function handleTest(gid: string, client: Client, memberId: string, guildId: string, reply: Reply, config: WelcomeData) {
  if (!config.channel) return reply(await t(gid, 'welcome.test_no_channel'));

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return reply(await t(gid, 'common.error'));

  const member = await guild.members.fetch(memberId).catch(() => null);
  if (!member) return reply(await t(gid, 'common.error'));

  client.emit('guildMemberAdd', member);
  return reply(await t(gid, 'welcome.test_success'));
}

async function handleView(gid: string, config: WelcomeData, reply: Reply) {
  const notSet = await t(gid, 'welcome.view_not_set');
  const channel = config.channel ? `<#${config.channel}>` : notSet;
  const msg = config.message || await t(gid, 'welcome.view_default_message');
  const color = config.color || '#91C4F2';
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

  return reply({ embeds: [embed] });
}

async function handleReset(gid: string, reply: Reply) {
  await resetWelcome(gid);
  return reply(await t(gid, 'welcome.reset_success'));
}

// ==========================================
// SLASH COMMAND
// ==========================================

const command: BotCommand = {
  name: 'welcome',
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure the welcome system')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub
      .setName('channel')
      .setDescription('Set the welcome channel')
      .addChannelOption(opt => opt.setName('channel').setDescription('The welcome channel').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('message')
      .setDescription('Set the welcome message')
      .addStringOption(opt => opt.setName('text').setDescription('Welcome message ({user} to mention)').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('image')
      .setDescription('Set the welcome banner image')
      .addStringOption(opt => opt.setName('url').setDescription('Image URL').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('color')
      .setDescription('Set the welcome embed color')
      .addStringOption(opt => opt.setName('hex').setDescription('HEX color code (e.g. #ff0000)').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('test')
      .setDescription('Simulate a new member entry'))
    .addSubcommand(sub => sub
      .setName('view')
      .setDescription('Show current welcome configuration'))
    .addSubcommand(sub => sub
      .setName('reset')
      .setDescription('Clear all welcome configuration')),

  async execute(interaction, client) {
    const gid = interaction.guildId!;
    const sub = interaction.options.getSubcommand();
    const config = await loadWelcome(gid);
    const reply: Reply = (content) => {
      if (typeof content === 'string') return interaction.reply(content);
      return interaction.reply(content);
    };

    switch (sub) {
      case 'channel': {
        const channel = interaction.options.getChannel('channel', true);
        return handleChannel(gid, channel.id, config, reply);
      }
      case 'message': {
        const text = interaction.options.getString('text', true);
        return handleMessage(gid, text, config, reply);
      }
      case 'image': {
        const url = interaction.options.getString('url', true);
        if (!url.startsWith('http')) return interaction.reply(await t(gid, 'welcome.image_usage'));
        return handleImage(gid, url, config, reply);
      }
      case 'color': {
        const hex = interaction.options.getString('hex', true);
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!hexRegex.test(hex)) return interaction.reply(await t(gid, 'welcome.color_usage'));
        return handleColor(gid, hex, config, reply);
      }
      case 'test':
        return handleTest(gid, client, interaction.user.id, gid, reply, config);
      case 'view':
        return handleView(gid, config, reply);
      case 'reset':
        return handleReset(gid, reply);
    }
  },

  // ==========================================
  // PREFIX COMMAND
  // ==========================================

  async executePrefix(message, args, client) {
    if (!message.member || !('permissions' in message.member)) return;
    if (!(message.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) return;

    const gid = message.guild!.id;
    const sub = args.shift()?.toLowerCase();
    const config = await loadWelcome(gid);
    const reply: Reply = (content) => {
      if (typeof content === 'string') return message.reply(content);
      return message.reply(content);
    };

    const validSubs = ['channel', 'message', 'image', 'color', 'test', 'view', 'reset'];
    if (!sub || !validSubs.includes(sub)) {
      const options = validSubs.map(s => `\`${s}\``).join(', ');
      return message.reply(await t(gid, 'welcome.subcommand_required', { options }));
    }

    switch (sub) {
      case 'channel': {
        const mentioned = message.mentions.channels.first();
        if (!mentioned) return message.reply(await t(gid, 'welcome.channel_usage'));
        return handleChannel(gid, mentioned.id, config, reply);
      }
      case 'message': {
        const text = args.join(' ');
        if (!text) return message.reply(await t(gid, 'welcome.message_usage'));
        return handleMessage(gid, text, config, reply);
      }
      case 'image': {
        const url = args[0];
        if (!url || !url.startsWith('http')) return message.reply(await t(gid, 'welcome.image_usage'));
        return handleImage(gid, url, config, reply);
      }
      case 'color': {
        const hex = args[0];
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!hex || !hexRegex.test(hex)) return message.reply(await t(gid, 'welcome.color_usage'));
        return handleColor(gid, hex, config, reply);
      }
      case 'test': {
        if (!message.member) return message.reply(await t(gid, 'common.error'));
        return handleTest(gid, client, message.author.id, gid, reply, config);
      }
      case 'view':
        return handleView(gid, config, reply);
      case 'reset':
        return handleReset(gid, reply);
    }
  },
};

export default command;
