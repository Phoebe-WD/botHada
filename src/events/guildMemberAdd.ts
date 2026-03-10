import { EmbedBuilder, GuildMember, ColorResolvable } from 'discord.js';
import { loadWelcome } from '../utils/config';
import { t } from '../utils/i18n';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberAdd',
  async execute(...args: unknown[]) {
    const member = args[0] as GuildMember;
    const gid = member.guild.id;
    const config = await loadWelcome(gid);

    if (!config.channel) return;

    const channel = member.guild.channels.cache.get(config.channel);
    if (!channel || !channel.isTextBased()) return;

    let text = config.message || await t(gid, 'welcome.default_message');
    const color = config.color || '#ffcc00';

    text = text.replace(/{user}/g, `<@${member.id}>`);

    const embed = new EmbedBuilder()
      .setColor(color as ColorResolvable)
      .setTitle(await t(gid, 'welcome.embed_title'))
      .setDescription(text)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }));

    if (config.image) {
      embed.setImage(config.image);
    }

    channel
      .send({ content: await t(gid, 'welcome.greeting', { userId: member.id }), embeds: [embed] })
      .catch(console.error);
  },
};

export default event;
