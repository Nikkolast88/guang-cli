import inquirer, { QuestionCollection } from "inquirer";
import fs from 'fs';
import semver from 'semver';
import { setupDownload, downloadTemplate } from './download';

const questionAnswer: QuestionCollection = [
    {
      name: 'name',
      type: 'input',
      message: 'package name:',
      default: 'app-name',
      validate: (value: string) => {
        if(!value) {
          return 'Missing required argument';
        };
        if(fs.existsSync(value)) {
          return 'File already exists';
        } else {
          return true;
        };
      },
    },
    {
      name: 'version',
      type: 'input',
      message: 'version:',
      default: '0.0.1',
      validate: (value: string) => {
        if (!semver.valid(value)) {
          return 'Incorrect version number';
        } else {
          return true;
        }
      },
    },
    {
      name: 'description',
      type: 'input',
      message: 'description:',
    },
    {
      name: 'keywords',
      type: 'input',
      message: 'keywords',
    },
    {
      name: 'author',
      type: 'input',
      message: 'author'
    },
    {
      name: 'template',
      type: 'list',
      choices: downloadTemplate,
    },
    {
      name: 'git',
      type: 'confirm',
      message: 'Initializing git repository ?'
    },
    {
      name: 'npm',
      type: 'confirm',
      message: 'Install npm ?'
    }
  ];

async function selectFeature() {
  
}

export const setupAnswer = async() => {
  const answer = await inquirer.prompt(questionAnswer);
  await setupDownload(answer);
};