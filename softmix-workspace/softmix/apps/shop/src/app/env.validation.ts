import { IsBoolean, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvValidationMessage } from '@project-lib/core';
import { Port } from '@project-lib/shared-types';

class EnvironmentsConfig {
  @IsString({
    message: EnvValidationMessage.DBNameNotRequired
  })
  public POSTGRES_DB: string;

  @IsString({
    message: EnvValidationMessage.DBHostNotRequired
  })
  public POSTGRES_HOST: string;

  @IsNumber({}, {
    message: EnvValidationMessage.DBPortNotRequired
  })
  @Min(Port.Min)
  @Max(Port.Max)
  public POSTGRES_PORT: number;

  @IsString({
    message: EnvValidationMessage.DBUserNotRequired
  })
  public POSTGRES_USER: string;

  @IsString({
    message: EnvValidationMessage.DBPasswordNotRequired
  })
  public POSTGRES_PASSWORD: string;

  @IsString({
    message: EnvValidationMessage.PgAdminEmailNotRequired
  })
  public PGADMIN_DEFAULT_EMAIL: string;

  @IsBoolean({
    message: EnvValidationMessage.PgAdminServerModeNotRequired
  })
  public PGADMIN_CONFIG_SERVER_MODE: boolean;
}

export function validateEnvironments(config: Record<string, unknown>) {
  const environmentsConfig = plainToInstance(
    EnvironmentsConfig,
    config,
    { enableImplicitConversion: true  },
  );

  const errors = validateSync(
    environmentsConfig, {
      skipMissingProperties: false
    }
  );

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return environmentsConfig;
}
