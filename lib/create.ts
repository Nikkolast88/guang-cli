import yargs from 'yargs';
import { setupAnswer } from './question';
module.exports = {
  command: 'create',
  describe: '创建项目',
  builder: (yargs: yargs.Argv) => {
    yargs.positional('name', {
      describe: '',
      normalize: true,
      type: 'string',
    })
  },
  handler: async (argv: yargs.Argv) => {
    await setupAnswer();
  },
};