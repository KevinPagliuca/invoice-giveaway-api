const inquirer = require('inquirer');
const { execSync } = require('child_process');

const allQuestions = async () => {
  const { pushNowAnswers } = await inquirer.prompt([
    {
      type: 'list',
      name: 'pushNowAnswers',
      message: 'Do you want to push this commit now?',
      choices: ['yes', 'no'],
    },
  ]);

  if (pushNowAnswers === 'yes') {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
    });

    let branchName =
      currentBranch && typeof currentBranch === 'string' && currentBranch !== ''
        ? currentBranch.trim()
        : '';

    const checkBranchName = async (input) => input && input.trim() !== '';

    const { branchNameAnswers } = await inquirer.prompt([
      {
        name: 'branchNameAnswers',
        message: '🚀 What is the name of the branch you want to push changes?',
        default: branchName,
        validate: checkBranchName,
      },
    ]);

    if (branchNameAnswers) execSync(`git push origin ${branchNameAnswers} --tags`);
  }
};

allQuestions();
