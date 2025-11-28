# @gulibs/tegg-sequelize

![NPM version](https://img.shields.io/npm/v/@gulibs/tegg-sequelize.svg?style=flat-square)

Tegg 的 Sequelize 插件，提供单 / 多数据库连接管理、TS 类型声明和配置约定。

> [English](README.md)

## 安装

```bash
npm i @gulibs/tegg-sequelize
```

or

```bash
yarn add @gulibs/tegg-sequelize
```

项目本身仍需要依赖：

```json
{
  "dependencies": {
    "@gulibs/tegg-sequelize": "^1.1.14",
    "sequelize": "^6",
    "reflect-metadata": "^0.2"
  }
}
```

> **注意**：您不需要直接安装 `sequelize-typescript`。所有装饰器和类型都已从 `@gulibs/tegg-sequelize` 重新导出，方便版本控制。

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
exports.teggSequelize = {
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
```

## 多数据源

```js
exports.teggSequelize = {
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

## 访问方式

- 单实例：`await app.teggSequelize.authenticate()`
- 多实例：`const writer = app.teggSequelizes.get('writer'); const reader = app.teggSequelizes.get('reader')`

## 使用装饰器和类型

所有常用的 `sequelize-typescript` 装饰器和类型都已从 `@gulibs/tegg-sequelize` 重新导出。您可以直接导入它们，无需安装 `sequelize-typescript`：

```typescript
// 替代：import { Table, Column, DataType } from '@gulibs/tegg-sequelize';
import { Table, Column, DataType, BelongsTo, ForeignKey, AllowNull, HasMany, Model } from '@gulibs/tegg-sequelize';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @HasMany(() => Post)
  posts!: Post[];
}
```

可用的导出包括：
- **装饰器**：`Table`, `Column`, `BelongsTo`, `BelongsToMany`, `HasOne`, `HasMany`, `ForeignKey`, `AllowNull`, `Default`, `Unique`, `PrimaryKey`, `AutoIncrement`, `CreatedAt`, `UpdatedAt`, `DeletedAt`, `Comment`, `Index`, `DefaultScope`, `Scopes`, `Validate` 以及所有验证装饰器
- **类型**：`Sequelize`, `SequelizeOptions`, `ModelCtor`, `Model`
- **常量**：`DataType`

## 自定义工厂

```js
exports.teggSequelize = {
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
