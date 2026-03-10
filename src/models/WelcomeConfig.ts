import { Schema, model } from 'mongoose';

interface IWelcomeConfig {
  guildId: string;
  channel?: string;
  message?: string;
  image?: string;
  color?: string;
}

const welcomeConfigSchema = new Schema<IWelcomeConfig>({
  guildId: { type: String, required: true, unique: true },
  channel: String,
  message: String,
  image: String,
  color: String,
});

export default model<IWelcomeConfig>('WelcomeConfig', welcomeConfigSchema);
