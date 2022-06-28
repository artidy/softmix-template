import {CliCommandInterface} from './cli-command.interface.js';
import {printCommand, printHeader} from './cli-functions.js';

class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
      ${printHeader('Программа для подготовки данных для REST API сервера.')}
      Пример:
          main.js ${printCommand('--command')} [--arguments]
      Команды:
          ${printCommand('--version')}:                                                   # выводит номер версии приложения
          ${printCommand('--help')}:                                                      # помощь по работе с CLI приложения
          ${printCommand('--import <path> <login> <password> <host> <dbname> <salt>')}:   # импортирует данные из файла в формате TSV
          ${printCommand('--generate <count> <filepath> <url>')}:                         # создает файл в формате TSV со случайно сгенерированными данными
    `);
  }
}

export default HelpCommand;
