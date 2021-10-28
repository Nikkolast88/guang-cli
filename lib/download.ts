import ora from 'ora';
import chalk from 'chalk';
import shell from 'shelljs';
import gitP, {SimpleGit} from 'simple-git/promise';
const gitClone: SimpleGit = gitP();

import fs from 'fs';
import { setupPack } from './question';
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
    name: 'vue-admin',
    value: 3,
    owner: 'drg',
    www: 'gitee.com',
    templateName: 'vue-admin-template',
    branch: 'master',
  },
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

    // pnpm install
    await installPkg(option);

    // handlebars
    await initPkgJson(option);
    
    spinner.succeed('初始化模板成功！');
  } else {
    console.log(chalk.red('Template failed. '));
  }
};

// 安装 git init
async function initGit(option: any) {
  await new Promise((resolve, reject) => {
    if (!option.git) return resolve('');
    const git = shell.which('git');
    if (!git) {
      console.log(chalk.red('Install Git'));
      return reject('');
    }
    const spinner = ora('Initializing git repository...\n').start();
    shell.exec('git init', (code) => {
      if (code) {
        spinner.fail();
        console.log(chalk.red('Git Init Fail'));
        return reject('');
      } else {
        spinner.succeed();
        return resolve('');
      }
    });
  });
};

// 安装 package
async function installPkg(option: any) {
  await new Promise((resolve, reject) => {
    if (!option.pnpm) return resolve('');
    const pnpm = shell.which('pnpm');
    if (!pnpm) {
      console.log(chalk.red('Install Pnpm'));
      return reject('');
    }
    console.log('Installing pnpm . This might take a while\n')
  
    const spinner = ora('Installing additional dependencies...\n').start();
    shell.exec('pnpm install', (code) => {
      if (code) {
        spinner.fail();
        console.log(chalk.red('Package Install Fail'));
        return reject('');
      } else {
        spinner.succeed();
        return resolve('');
      }
    });
  });
}

// json => package.json
async function initPkgJson(option: any) {
  await new Promise(( resolve, reject ) => {
    const spinner = ora('Merging configuration...\n').start();
    
    const fileName = `${option.pnpm ? '.' : `../${option.name}`}/package.json`;
    const content = fs.readFileSync(fileName, 'utf8');
    const json = JSON.parse(content);
    for (let key in setupPack) {
      const item = setupPack[key];
      json[item.name] = option[item.name];
    }
    fs.writeFileSync(fileName, JSON.stringify(json, null,'\t'));
    spinner.succeed();
    return resolve('');
  });
}