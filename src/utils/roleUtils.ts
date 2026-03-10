import { MessageReaction, User, type PartialMessageReaction, type PartialUser } from 'discord.js';
import { BotClient } from '@/client/BotClient.js';

export async function handleReaction(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  type: 'add' | 'remove'
): Promise<void> {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  const client = reaction.message.client as BotClient;
  const config = client.configService.getConfig();
  const emojiUsado = reaction.emoji.toString();
  const rolId = config[emojiUsado];

  if (!rolId) return;

  const guild = reaction.message.guild;
  if (!guild) return;

  const miembro = await guild.members.fetch(user.id).catch(() => null);
  if (!miembro) return;

  try {
    if (type === 'add') {
      await miembro.roles.add(rolId);
    } else {
      await miembro.roles.remove(rolId);
    }
  } catch (error) {
    console.error(`Error ${type === 'add' ? 'adding' : 'removing'} role:`, error);
  }
}
