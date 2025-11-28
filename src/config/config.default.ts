import type { EggAppConfig, PowerPartial } from 'egg';
import type { EggSequelizeConfig } from '../types.js';
import { markAsDefaultConfig } from '../constants.js';

/**
 * egg-tegg-sequelize default config
 * Mirrors the guidance from the Tegg MySQL docs:
 * https://github.com/gulibs/tegg-socket.io/tree/main/docs/tegg文档/教程/MySQL.md
 */
export default () => {
  const config = {} as PowerPartial<EggAppConfig>;

  const defaultSequelizeConfig: EggSequelizeConfig = markAsDefaultConfig({
    default: {
      models: ['app/model'],
    },
    app: true,
    agent: false,
  });

  config.teggSequelize = defaultSequelizeConfig;

  return config;
};
