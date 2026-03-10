import { Events, MessageReaction, User } from 'discord.js';
import type { IEvent } from '@/types/index.js';
import { handleReaction } from '@/utils/roleUtils.js';

export const event: IEvent<Events.MessageReactionAdd> = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    await handleReaction(reaction, user, 'add');
  },
};
