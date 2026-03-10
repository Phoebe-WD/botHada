import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import type { IBotConfig } from '@/types/index.js';

const ConfigSchema = z.record(z.string()).and(
  z.object({
    canalBienvenida: z.string().optional(),
    mensajeBienvenida: z.string().optional(),
    imagenBienvenida: z.string().optional(),
    colorBienvenida: z.string().optional(),
  })
);

export class ConfigService {
  private readonly configPath = path.resolve(process.cwd(), './rols/rolesConfig.json');

  constructor() {
    this.ensureConfigExists();
  }

  private ensureConfigExists(): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, JSON.stringify({}));
    }
  }

  public getConfig(): IBotConfig {
    try {
      const rawData = fs.readFileSync(this.configPath, 'utf-8');
      const jsonData = JSON.parse(rawData);
      return ConfigSchema.parse(jsonData) as IBotConfig;
    } catch (error) {
      console.error('Error reading config:', error);
      return {};
    }
  }

  public saveConfig(data: IBotConfig): void {
    try {
      const validatedData = ConfigSchema.parse(data);
      fs.writeFileSync(this.configPath, JSON.stringify(validatedData, null, 4));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  public updateKey(key: string, value: string): void {
    const config = this.getConfig();
    config[key] = value;
    this.saveConfig(config);
  }

  public deleteKey(key: string): void {
    const config = this.getConfig();
    delete config[key];
    this.saveConfig(config);
  }
}
