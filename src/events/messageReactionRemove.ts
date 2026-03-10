import { MessageReaction, User } from 'discord.js';
import { findRoleByEmoji } from '../utils/config';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'messageReactionRemove',
  async execute(...args: unknown[]) {
    const reaction = args[0] as MessageReaction;
    const user = args[1] as User;

    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const guild = reaction.message.guild;
    if (!guild) return;

    const emoji = reaction.emoji.toString();
    const roleId = await findRoleByEmoji(guild.id, emoji);

    if (!roleId) return;

    try {
      const member = await guild.members.fetch(user.id);
      await member.roles.remove(roleId);
    } catch (error) {
      console.error('Failed to remove reaction role:', error);
    }
  },
};

export default event;
