import { Schema, model } from 'mongoose';

interface IRoleBinding {
  guildId: string;
  emoji: string;
  roleId: string;
}

const roleBindingSchema = new Schema<IRoleBinding>({
  guildId: { type: String, required: true },
  emoji: { type: String, required: true },
  roleId: { type: String, required: true },
});

roleBindingSchema.index({ guildId: 1, emoji: 1 }, { unique: true });

export default model<IRoleBinding>('RoleBinding', roleBindingSchema);
