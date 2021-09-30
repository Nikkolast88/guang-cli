import ora from 'ora';
import chalk from 'chalk';
import shell from 'shelljs';
import gitP, {SimpleGit} from 'simple-git/promise';
const gitClone: SimpleGit = gitP();

export const downloadTemplate = [
  {
    name: '微前端（主）',
    value: 1,
    owner: 'DengRiGuang',
    www: 'github.com',
    templateName: 'micro-main',
    branch: 'main',
  },
  {
    name: '微前端（子）',
    value: 2,
    owner: 'DengRiGuang',
    www: 'github.com',
    templateName: 'micro-sub',
    branch: 'main',
  },
  {
    name: 'Vite',
    value: 3,
    owner: 'drg',
    www: 'gitee.com',
    templateName: 'nestjs-template',
    branch: 'master',
  }
];

export const setupDownload = async(option: any) => {
  const spinner = ora('Downloading template...\n');
  const template = downloadTemplate.find((temp: any) => temp.value === option.template);

  if (template) {
    const { owner, www, templateName, branch } = template;
    spinner.start();
    const url = `https://${www}/${owner}/${templateName}.git`;
    
    try {
      await gitClone.clone(url, `${process.cwd()}/${option.name}`);
    } catch (error) {
      spinner.fail();
      console.log(chalk.red(`Template Download Fail ${error}`))
    }

    // 删除初始.git文件
    await shell.rm('-rf', `${process.cwd()}/${option.name}/.git`);
    spinner.succeed();

    // 进入项目目录
    await shell.cd(option.name);

    // git init repository
    await initGit(option);

    // npm install
    await installPkg(option);
  } else {
    console.log(chalk.red('Template failed. '));
  }
};

// 安装 npm
async function initGit(option: any) {
  await new Promise((resolve, reject) => {
    if (!option.git) reject('');
    const git = shell.which('git');
    if (!git) {
      console.log(chalk.red('Install Git'));
      reject('');
    }
    const spinner = ora('Initializing git repository...\n').start();
    shell.exec('git init', (code) => {
      if (code) {
        spinner.fail();
        console.log(chalk.red('Git Init Fail'));
        reject('');
      } else {
        spinner.succeed();
        resolve('');
      }
    });
  });
};

// 安装 package
async function installPkg(option: any) {
  await new Promise((resolve, reject) => {
    if (!option.npm) reject('');
    const npm = shell.which('npm');
    if (!npm) {
      console.log(chalk.red('Install Npm'));
      reject('');
    }
    console.log('Installing npm . This might take a while\n')
  
    const spinner = ora('Installing additional dependencies...\n').start();
    shell.exec('npm install', (code) => {
      if (code) {
        spinner.fail();
        console.log(chalk.red('Package Install Fail'));
        reject('');
      } else {
        spinner.succeed();
        resolve('');
      }
    });
  });
}