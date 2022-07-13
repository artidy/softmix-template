#!/usr/bin/env node

import CliApplication from './app/cli-application.js';
import HelpCommand from './cli-command/help-command.js';
import VersionCommand from './cli-command/version-command.js';
import GenerateCommand from './cli-command/generate-command.js';

const manager = new CliApplication();

manager.registerCommands([
  new HelpCommand,
  new VersionCommand,
  new GenerateCommand,
]);

manager.processCommand(process.argv);
