exports.keys = '123456';

function buildClientOptions(name) {
  return {
    database: name,
    username: name,
    host: '127.0.0.1',
    customFactory(options) {
      const FakeCtor = global.FakeSequelizeForTest;
      if (!FakeCtor) {
        throw new Error('FakeSequelizeForTest is not registered');
      }
      return new FakeCtor({
        ...options,
        clientName: name,
      });
    },
  };
}

const shared = {
  default: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  clients: {
    writer: buildClientOptions('writer'),
    reader: buildClientOptions('reader'),
  },
  app: true,
  agent: false,
};

exports.teggSequelize = shared;
exports.tsSequelize = shared;
