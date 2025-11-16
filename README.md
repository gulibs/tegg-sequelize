# @eggjs/tegg-sequelize

[![NPM version](npm-image)][npm-url]
[![Test coverage](codecov-image)][codecov-url]
[![Known Vulnerabilities](snyk-image)][snyk-url]
[![npm download](download-image)][download-url]

[npm-image]: https://img.shields.io/npm/v/@eggjs/tegg-sequelize.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@eggjs/tegg-sequelize
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/tegg-sequelize.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/tegg-sequelize?branch=master
[snyk-image]: https://snyk.io/test/npm/@eggjs/tegg-sequelize/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/@eggjs/tegg-sequelize
[download-image]: https://img.shields.io/npm/dm/@eggjs/tegg-sequelize.svg?style=flat-square
[download-url]: https://npmjs.org/package/@eggjs/tegg-sequelize

<!--
Description here.
-->

## Install

```bash
npm i @eggjs/tegg-sequelize
```

## Usage

```js
// {app_root}/config/plugin.js
exports.teggSequelize = {
  enable: true,
  package: '@eggjs/tegg-sequelize',
};
```

## Configuration

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

### Multiple clients

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

### Accessing clients

- Single client: `await app.tsSequelize.authenticate()`.
- Multiple clients: `const writer = app.tsSequelize.get('writer'); const reader = app.tsSequelizes.get('reader');`.
- Aliases `app.teggSequelize` and `app.teggSequelizes` are kept for convenience.

### Custom client factories

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

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=eggjs/tegg-sequelize)](https://github.com/eggjs/tegg-sequelize/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
