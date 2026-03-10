import { Events, MessageReaction, User } from 'discord.js';
import type { IEvent } from '@/types/index.js';
import { handleReaction } from '@/utils/roleUtils.js';

export const event: IEvent<Events.MessageReactionRemove> = {
  name: Events.MessageReactionRemove,
  async execute(reaction, user) {
    await handleReaction(reaction, user, 'remove');
  },
};
