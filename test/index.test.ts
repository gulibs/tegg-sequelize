import assert from 'node:assert';
import type { Singleton } from '@eggjs/core';
import { mm, MockApplication } from '@eggjs/mock';
import { CLIENT_NAME_SYMBOL } from '../src/lib/loader.js';

class FakeSequelize {
  static instances: FakeSequelize[] = [];
  public readonly options: Record<string, unknown>;
  [CLIENT_NAME_SYMBOL]?: string;

  constructor(options: Record<string, unknown>) {
    this.options = options;
    FakeSequelize.instances.push(this);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var FakeSequelizeForTest: typeof FakeSequelize | undefined;
}

describe('test/index.test.ts', () => {
  let app: MockApplication;

  before(() => {
    global.FakeSequelizeForTest = FakeSequelize;
    app = mm.app({
      baseDir: 'apps/example',
    });
    return app.ready();
  });

  after(async () => {
    await app.close();
    delete global.FakeSequelizeForTest;
  });

  afterEach(() => {
    mm.restore();
  });

  it('should GET /', async () => {
    await app.httpRequest()
      .get('/')
      .expect('hi, teggSequelize')
      .expect(200);
  });

  it('should expose multi client singleton helpers', () => {
    const singleton = app.tsSequelize as unknown as Singleton<FakeSequelize>;
    const writer = singleton.get('writer');
    const reader = (app.tsSequelizes as Singleton<FakeSequelize>).get('reader');

    assert(writer instanceof FakeSequelize);
    assert(reader instanceof FakeSequelize);
    assert.deepStrictEqual(writer?.options.models, [ 'app/model' ]);
    assert.strictEqual(writer?.[CLIENT_NAME_SYMBOL], 'writer');
    assert.strictEqual(reader?.[CLIENT_NAME_SYMBOL], 'reader');
  });

  it('should alias teggSequelize to tsSequelize', () => {
    assert.strictEqual(app.tsSequelize, app.tsSequelizes);
    assert.strictEqual(app.tsSequelize, app.teggSequelize);
    assert.strictEqual(app.tsSequelizes, app.teggSequelizes);
  });
});
