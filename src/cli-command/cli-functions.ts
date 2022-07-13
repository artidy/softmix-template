import chalk from 'chalk';

const printHeader = chalk.bold.bgBlackBright.hex('#008080');

const printCommand = chalk.blue;

const printError = chalk.bold.red;

const printInfo = chalk.yellow.bgGray;

const printSuccess = chalk.green;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export {
  printHeader,
  printCommand,
  printError,
  printInfo,
  printSuccess,
  getErrorMessage
};
