import { Schema, model } from 'mongoose';

interface IGuildConfig {
  guildId: string;
  language: string;
}

const guildConfigSchema = new Schema<IGuildConfig>({
  guildId: { type: String, required: true, unique: true },
  language: { type: String, default: 'es' },
});

export default model<IGuildConfig>('GuildConfig', guildConfigSchema);
