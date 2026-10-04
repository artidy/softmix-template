import { Logger } from '@nestjs/common';

// В тестах сервисы намеренно получают ошибки — их логи только засоряют вывод.
Logger.overrideLogger(false);
