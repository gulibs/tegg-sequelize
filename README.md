# @gulibs/tegg-sequelize

![NPM version](https://img.shields.io/npm/v/@gulibs/tegg-sequelize.svg?style=flat-square)

> [中文文档](README.zh_CN.md)

Sequelize integration for the Tegg runtime, with single/multi client support and TypeScript definitions.

## Install

```bash
npm i @gulibs/tegg-sequelize
```

Host applications should also declare the direct database dependencies:

```json
{
  "dependencies": {
    "@gulibs/tegg-sequelize": "^1.1.6",
    "sequelize": "^6",
    "sequelize-typescript": "^2",
    "reflect-metadata": "^0.2"
  }
}
```

## Enable Plugin

```js
// {app_root}/config/plugin.js
exports.teggSequelize = {
  enable: true,
  package: '@gulibs/tegg-sequelize',
};
```

## Base Configuration

```js
// {app_root}/config/config.default.js
exports.tsSequelize = {
  app: true,
  agent: false,
  client: {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'test',
    database: 'app',
    models: [ 'app/model' ],
  },
};
// For backward compatibility the plugin also reads `exports.teggSequelize`
exports.teggSequelize = exports.tsSequelize;
```

## Multiple clients

Following the pattern documented in the official Tegg 文档（教程 /MySQL 篇），you can declare multiple Sequelize clients:

```js
exports.tsSequelize = {
  default: {
    dialect: 'mysql',
    port: 3306,
    models: [ 'app/model' ],
  },
  clients: {
    writer: {
      host: '10.0.0.10',
      username: 'write_user',
      password: 'secret',
      database: 'main',
    },
    reader: {
      host: '10.0.0.11',
      username: 'read_user',
      password: 'secret',
      database: 'main',
    },
  },
  app: true,
  agent: false,
};
```

see [src/config/config.default.ts](src/config/config.default.ts) for more detail.

## Accessing clients

- Single client: `await app.tsSequelize.authenticate()`.
- Multiple clients: `const writer = app.tsSequelize.get('writer'); const reader = app.tsSequelizes.get('reader');`.
- Aliases `app.teggSequelize` and `app.teggSequelizes` are kept for convenience.

## Custom client factories

For integration tests or multi-tenant scenarios you can override how a client instance is created via `customFactory` on any `client` / `clients` entry:

```js
exports.tsSequelize = {
  clients: {
    shadow: {
      database: 'shadow',
      username: 'shadow',
      password: 'shadow',
      customFactory(options, app, clientName) {
        // Return any Sequelize-compatible object
        return new MockSequelize(options);
      },
    },
  },
};
```

The factory receives the normalized options (with `models` defaulted to `['app/model']`), the current `EggCore` instance, and the `clientName` being registered.

## Example

<!-- example here -->

## More

- See `src/config/config.default.ts` for detailed options.
- Issues & feature requests: <https://github.com/gulibs/tegg-sequelize/issues>
- License: [MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=gulibs/tegg-sequelize)](https://github.com/gulibs/tegg-sequelize/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
