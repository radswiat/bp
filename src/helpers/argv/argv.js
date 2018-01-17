import opt from 'optimist';

export default new class Argv {

  argv = opt.argv._;

  getAction() {
    return this.argv[0];
  }

  getParam(orderId) {
    return this.argv[orderId];
  }
};
