# @gulibs/tegg-sequelize

[![NPM version](npm-image)][npm-url]
[![Test coverage](codecov-image)][codecov-url]
[![Known Vulnerabilities](snyk-image)][snyk-url]
[![npm download](download-image)][download-url]

[npm-image]: https://img.shields.io/npm/v/@gulibs/tegg-sequelize.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@gulibs/tegg-sequelize
[codecov-image]: https://img.shields.io/codecov/c/github/gulibs/tegg-sequelize.svg?
style=flat-square
[codecov-url]: https://codecov.io/github/gulibs/tegg-sequelize?branch=master
[snyk-image]: https://snyk.io/test/npm/@gulibs/tegg-sequelize/badge.svg?
style=flat-square
[snyk-url]: https://snyk.io/test/npm/@gulibs/tegg-sequelize
[download-image]: https://img.shields.io/npm/dm/@gulibs/tegg-sequelize.svg?
style=flat-square
[download-url]: https://npmjs.org/package/@gulibs/tegg-sequelize

[英文文档](README.md)

Tegg 的 Sequelize 插件，提供单 / 多数据库连接管理、TS 类型声明和配置约定。

## 安装

```bash
npm i @eggjs/tegg-sequelize
```

项目本身仍需要依赖：

```json
{
  "dependencies": {
    "@gulibs/tegg-sequelize": "^1.1.4",
    "sequelize": "^6",
    "sequelize-typescript": "^2",
    "reflect-metadata": "^0.2"
  }
}
```

## 启用插件

```js
// {app_root}/config/plugin.js
exports.teggSequelize = {
  enable: true,
  package: '@eggjs/tegg-sequelize',
};
```

## 基础配置

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
// 兼容老项目
exports.teggSequelize = exports.tsSequelize;
```

## 多数据源

```js
exports.tsSequelize = {
  default: {
    dialect: 'mysql',
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
};
```

访问方式：

- 单实例：`await app.tsSequelize.authenticate()`
- 多实例：`const writer = app.tsSequelizes.get('writer')`
- 兼容别名：`app.teggSequelize` / `app.teggSequelizes`

## 自定义工厂

```js
exports.tsSequelize = {
  clients: {
    mock: {
      database: 'mock',
      customFactory(options, app, clientName) {
        return new MockSequelize(options);
      },
    },
  },
};
```

`customFactory` 可以在集成测试或多租户场景中生成自定义的 Sequelize 实例。

## 更多

- 详见 `src/config/config.default.ts`
- 问题反馈：<https://github.com/gulibs/tegg-sequelize/issues>
- 许可证：MIT
