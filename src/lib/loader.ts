import type { EggCore } from '@eggjs/core';
import type { Application } from 'egg';
import { Sequelize } from 'sequelize-typescript';
import type {
  EggSequelize,
  EggSequelizeClientOption,
  EggSequelizeClientRuntimeOptions,
} from '../types.js';

export const CLIENT_NAME_SYMBOL = Symbol.for('TEGG-SEQUELIZE#CLIENT_NAME');
const ALIAS_SYMBOL = Symbol.for('TEGG-SEQUELIZE#ALIASES_READY');

type EggSequelizeWithMeta = EggSequelize & { [CLIENT_NAME_SYMBOL]?: string };

function createOneClient(
  config: EggSequelizeClientOption = {},
  app: EggCore,
  clientName = 'teggSequelize',
): EggSequelize {
  const { models, customFactory, ...restConfig } = config;
  const resolvedModels = models ?? ['app/model'];
  const runtimeOptions: EggSequelizeClientRuntimeOptions = {
    ...restConfig,
    models: resolvedModels,
  };

  app.logger.info(
    '[tegg-sequelize] client connecting %s@%s:%s/%s',
    runtimeOptions.username ?? '<anonymous>',
    runtimeOptions.host ?? 'localhost',
    runtimeOptions.port ?? '',
    runtimeOptions.database ?? '',
  );

  const client = (customFactory
    ? customFactory(runtimeOptions, app, clientName)
    : new Sequelize(runtimeOptions)
  ) as EggSequelizeWithMeta;
  client[CLIENT_NAME_SYMBOL] = clientName;

  return client;
}

function ensureAliasAccessors(app: Application): void {
  const flagApp = app as Application & { [ALIAS_SYMBOL]?: boolean };
  if (flagApp[ALIAS_SYMBOL]) {
    return;
  }

  const aliasMap: Record<string, string> = {
    teggSequelizes: 'teggSequelize',
  };

  for (const [alias, target] of Object.entries(aliasMap)) {
    if (Object.getOwnPropertyDescriptor(app, alias)) {
      continue;
    }
    Reflect.defineProperty(app, alias, {
      configurable: true,
      enumerable: false,
      get() {
        return (app as unknown as Record<string, unknown>)[target];
      },
    });
  }

  flagApp[ALIAS_SYMBOL] = true;
}

export function initPlugin(app: Application): void {
  app.logger.info('[tegg-sequelize] initPlugin starting...');
  app.addSingleton('teggSequelize', createOneClient);
  ensureAliasAccessors(app);
}

