import 'dotenv/config';
import { BotClient } from '@/client/BotClient.js';

const client = new BotClient();

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN is not defined in .env');
  process.exit(1);
}

client.start(process.env.DISCORD_TOKEN).catch(error => {
  console.error('❌ Failed to start bot:', error);
});
