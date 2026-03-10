import RoleBinding from '../models/RoleBinding';
import WelcomeConfig from '../models/WelcomeConfig';
import GuildConfig from '../models/GuildConfig';
import { RolesData, WelcomeData } from '../types';

// ==========================================
// ROLES
// ==========================================

export async function loadRoles(guildId: string): Promise<RolesData> {
  const bindings = await RoleBinding.find({ guildId });
  const roles: RolesData = {};
  for (const b of bindings) {
    roles[b.emoji] = b.roleId;
  }
  return roles;
}

export async function findRoleByEmoji(guildId: string, emoji: string): Promise<string | null> {
  const binding = await RoleBinding.findOne({ guildId, emoji });
  return binding?.roleId || null;
}

export async function saveRole(guildId: string, emoji: string, roleId: string): Promise<void> {
  await RoleBinding.findOneAndUpdate(
    { guildId, emoji },
    { $set: { roleId }, $setOnInsert: { guildId, emoji } },
    { upsert: true },
  );
}

export async function deleteRole(guildId: string, emoji: string): Promise<boolean> {
  const result = await RoleBinding.deleteOne({ guildId, emoji });
  return result.deletedCount > 0;
}

// ==========================================
// WELCOME
// ==========================================

export async function loadWelcome(guildId: string): Promise<WelcomeData> {
  const config = await WelcomeConfig.findOne({ guildId });
  if (!config) return {};
  return {
    channel: config.channel,
    message: config.message,
    image: config.image,
    color: config.color,
  };
}

export async function saveWelcome(guildId: string, data: WelcomeData): Promise<void> {
  await WelcomeConfig.findOneAndUpdate(
    { guildId },
    { $set: data, $setOnInsert: { guildId } },
    { upsert: true },
  );
}

export async function resetWelcome(guildId: string): Promise<void> {
  await WelcomeConfig.deleteOne({ guildId });
}

// ==========================================
// GUILD CONFIG (language)
// ==========================================

export async function getGuildLanguage(guildId: string): Promise<string> {
  const config = await GuildConfig.findOne({ guildId });
  return config?.language || 'es';
}

export async function setGuildLanguage(guildId: string, language: string): Promise<void> {
  await GuildConfig.findOneAndUpdate(
    { guildId },
    { $set: { language }, $setOnInsert: { guildId } },
    { upsert: true },
  );
}
