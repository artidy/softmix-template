import {CliCommandInterface} from '../cli-command/cli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[];
}

class CliApplication {
  private commands: {[propertyName: string]: CliCommandInterface} = {};
  private defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArguments.reduce((acc, cliCommand) => {
      if (cliCommand.startsWith('--')) {
        acc[cliCommand] = [];
        command = cliCommand;
      } else if (command && cliCommand) {
        acc[command].push(cliCommand);
      }

      return acc;
    }, parsedCommand);
  }

  public registerCommands(commandList: CliCommandInterface[]): void {
    this.commands = commandList.reduce((acc, Command) => {
      const cliCommand = Command;

      acc[cliCommand.name] = cliCommand;

      return acc;
    }, this.commands);
  }

  public getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];

    command.execute(...commandArguments);
  }
}

export default CliApplication;
