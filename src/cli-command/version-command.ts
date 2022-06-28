import {readFileSync} from 'fs';

import {CliCommandInterface} from './cli-command.interface.js';
import {printInfo} from './cli-functions.js';

class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private getVersion(): string {
    const packageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(packageJSON);

    return content.version;
  }

  public async execute() {
    const version = this.getVersion();

    console.log(printInfo(version));
  }
}

export default VersionCommand;
