import type { ILifecycleBoot } from '@eggjs/core';
import type { Application } from 'egg';
import type { EggSequelizeConfig } from './types.js';
import { clearDefaultFlag } from './constants.js';
import { initPlugin } from './lib/loader.js';

export class SequelizeBootHook implements ILifecycleBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configDidLoad(): void {
    const config = this.getNormalizedConfig();
    if (!config || !this.shouldLoad(config)) {
      return;
    }
    initPlugin(this.app);
  }

  private getNormalizedConfig(): EggSequelizeConfig | undefined {
    const resolvedConfig = this.app.config.teggSequelize;
    if (!resolvedConfig) {
      return undefined;
    }

    clearDefaultFlag(resolvedConfig);
    return resolvedConfig;
  }

  private shouldLoad(config: EggSequelizeConfig): boolean {
    if (this.app.type === 'application') {
      return config.app !== false;
    }

    if (this.app.type === 'agent') {
      return config.agent === true;
    }

    return true;
  }
}

