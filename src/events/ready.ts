import { Events, type Client } from 'discord.js';
import type { IEvent } from '@/types/index.js';

export const event: IEvent<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client<true>) {
    console.log(`¡Todo listo! El bot ${client.user.tag} está conectado.`);
  },
};
