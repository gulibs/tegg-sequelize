import type { EggCore, Singleton } from '@eggjs/core';
import type { Sequelize, SequelizeOptions } from '@gulibs/tegg-sequelize';

export type EggSequelize = Sequelize;

export interface EggSequelizeClientRuntimeOptions extends Omit<SequelizeOptions, 'modelPaths'> {
  models?: SequelizeOptions['models'];
}

export type EggSequelizeFactory = (
  options: EggSequelizeClientRuntimeOptions,
  app: EggCore,
  clientName: string
) => EggSequelize;

export interface EggSequelizeClientOption extends EggSequelizeClientRuntimeOptions {
  customFactory?: EggSequelizeFactory;
}

export type EggSequelizeClientsOption = Record<string, EggSequelizeClientOption>;

export interface EggSequelizeConfig {
  /**
       * Default options mixed into every client (single or multi)
       */
  default?: EggSequelizeClientOption;
  /**
   * Whether to load singleton onto app process
   * @default true
   */
  app?: boolean;
  /**
   * Whether to load singleton onto agent process
   * @default false
   */
  agent?: boolean;
  client?: EggSequelizeClientOption;
  clients?: EggSequelizeClientsOption;
}

declare module '@eggjs/core' {
  interface EggAppConfig {
    teggSequelize: EggSequelizeConfig;
  }
}

declare module 'egg' {
  interface Application {
    /**
         * Primary Sequelize client, defined via `config.teggSequelize.client`
         * or derived from `config.teggSequelize.clients`.
         */
    teggSequelize: EggSequelize;
    /**
         * Singleton helper when multiple clients are configured.
         * Use `app.teggSequelizes.get('clientId')` to access specific clients.
         */
    teggSequelizes: Singleton<EggSequelize>;
  }
}

