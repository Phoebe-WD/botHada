import { MessageReaction, User } from 'discord.js';
import { findRoleByEmoji } from '../utils/config';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'messageReactionAdd',
  async execute(...args: unknown[]) {
    const reaction = args[0] as MessageReaction;
    const user = args[1] as User;

    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const guildId = reaction.message.guild?.id;
    if (!guildId) return;

    const emoji = reaction.emoji.toString();
    const roleId = await findRoleByEmoji(guildId, emoji);

    if (!roleId) return;

    const member = reaction.message.guild?.members.cache.get(user.id);
    if (member) {
      await member.roles.add(roleId).catch(console.error);
    }
  },
};

export default event;
