import type { EggCore } from '@eggjs/core';
import type { Application } from 'egg';
import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';
import path from 'node:path';
import type {
  EggSequelize,
  EggSequelizeClientOption,
  EggSequelizeClientRuntimeOptions,
} from '../types.js';

export const CLIENT_NAME_SYMBOL = Symbol.for('TEGG-SEQUELIZE#CLIENT_NAME');
const ALIAS_SYMBOL = Symbol.for('TEGG-SEQUELIZE#ALIASES_READY');

type EggSequelizeWithMeta = EggSequelize & { [CLIENT_NAME_SYMBOL]?: string };

function resolveModelPaths(
  models: SequelizeOptions['models'],
  baseDir: string,
): SequelizeOptions['models'] {
  if (!models) {
    return [path.join(baseDir, 'app/model')];
  }

  // If models is already an array of constructors, return as-is
  if (Array.isArray(models) && models.length > 0 && typeof models[0] === 'function') {
    return models;
  }

  // Convert string paths to absolute paths
  // At this point, models must be string or string[]
  const modelPaths: string[] = Array.isArray(models)
    ? (models as string[])
    : [models as string];

  return modelPaths.map(modelPath => {
    // If it's already an absolute path, return as-is
    if (path.isAbsolute(modelPath)) {
      return modelPath;
    }
    // Resolve relative to baseDir
    return path.join(baseDir, modelPath);
  });
}

function createOneClient(
  config: EggSequelizeClientOption = {},
  app: EggCore,
  clientName = 'default',
): EggSequelize {
  const { models, customFactory, ...restConfig } = config;
  const baseDir = (app as Application).baseDir || process.cwd();
  const resolvedModels = resolveModelPaths(models, baseDir);
  const runtimeOptions: EggSequelizeClientRuntimeOptions = {
    ...restConfig,
    models: resolvedModels,
  };

  app.logger.info(
    '[tegg-sequelize] client[%s] connecting %s@%s:%s/%s',
    clientName,
    runtimeOptions.username ?? '<anonymous>',
    runtimeOptions.host ?? 'localhost',
    runtimeOptions.port ?? '',
    runtimeOptions.database ?? '',
  );

  // Log resolved model paths for debugging
  if (Array.isArray(resolvedModels) && resolvedModels.length > 0) {
    if (typeof resolvedModels[0] === 'string') {
      app.logger.info('[tegg-sequelize] client[%s] model paths: %s', clientName, JSON.stringify(resolvedModels));
    } else {
      app.logger.info('[tegg-sequelize] client[%s] models: %d model classes', clientName, resolvedModels.length);
    }
  }

  let client: EggSequelizeWithMeta;
  try {
    client = (customFactory
      ? customFactory(runtimeOptions, app, clientName)
      : new Sequelize(runtimeOptions)
    ) as EggSequelizeWithMeta;
  } catch (error) {
    app.logger.error('[tegg-sequelize] client[%s] Failed to create Sequelize instance: %s', clientName, error);
    app.logger.error('[tegg-sequelize] client[%s] Error stack: %s', clientName, (error as Error).stack);
    throw error;
  }

  client[CLIENT_NAME_SYMBOL] = clientName;

  // Log loaded models count for debugging
  // Note: models might not be loaded immediately, so we check after a short delay
  setTimeout(() => {
    try {
      const modelCount = Object.keys(client.models).length;
      app.logger.info('[tegg-sequelize] client[%s] loaded %d models', clientName, modelCount);
      if (modelCount > 0) {
        const modelNames = Object.keys(client.models).slice(0, 20);
        app.logger.info('[tegg-sequelize] client[%s] model names: %s', clientName, modelNames.join(', '));
        if (modelCount > 20) {
          app.logger.info('[tegg-sequelize] client[%s] ... and %d more models', clientName, modelCount - 20);
        }
      } else {
        app.logger.warn('[tegg-sequelize] client[%s] WARNING: No models loaded!', clientName);
        app.logger.warn('[tegg-sequelize] client[%s] Check: 1) Model paths are correct 2) Model files have default exports 3) No circular dependencies', clientName);
      }
    } catch (error) {
      app.logger.error('[tegg-sequelize] client[%s] Error checking models: %s', clientName, error);
    }
  }, 100);

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

