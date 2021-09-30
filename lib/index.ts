import yargs from "yargs";
import chalk from 'chalk';
import figlet from 'figlet';
import { hideBin } from 'yargs/helpers';


  // 艺术字
  console.log(chalk.yellow(figlet.textSync('GUANG-CLI', {
    horizontalLayout: 'full'
  })));
  
  const args = hideBin(process.argv);
  
  // 首次输入
  yargs(args)
  .usage('Usage: guang <command> [options]')
    .example('guang -v', '0.0.1')
    .strict() // 严格模式
    .alias('h', 'help')  // 别名
    .alias('v', 'version') // 别名
    .epilog('copyright 2021')  // 结尾内容
    .demandCommand() // 空参数
    .recommendCommands() // 命令纠错提示
    .help()
    .command(require('./create'))
    .argv;