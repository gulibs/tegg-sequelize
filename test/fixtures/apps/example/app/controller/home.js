const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.teggSequelize.name;
    this.logger.warn('plugin config: %o', this.app.config.teggSequelize);
  }
}

module.exports = HomeController;
