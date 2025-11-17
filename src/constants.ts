import type { EggSequelizeConfig } from './types.js';

const DEFAULT_CONFIG_FLAG = '__teggSequelizeDefault__';

type FlaggedConfig = EggSequelizeConfig & {
  [DEFAULT_CONFIG_FLAG]?: boolean;
};

export function markAsDefaultConfig(config: EggSequelizeConfig): EggSequelizeConfig {
  Object.defineProperty(config, DEFAULT_CONFIG_FLAG, {
    value: true,
    configurable: true,
    enumerable: false,
    writable: false,
  });
  return config;
}

export function isDefaultConfig(config?: EggSequelizeConfig): config is FlaggedConfig {
  return Boolean(config && (config as FlaggedConfig)[DEFAULT_CONFIG_FLAG]);
}

export function clearDefaultFlag(config?: EggSequelizeConfig): void {
  if (!config) return;
  Reflect.deleteProperty(config as FlaggedConfig, DEFAULT_CONFIG_FLAG);
}

