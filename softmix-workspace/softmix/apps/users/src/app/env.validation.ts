import { IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvValidationMessage } from '@project-lib/core';
import { Port } from '@project-lib/shared-types';

class EnvironmentsConfig {
  @IsString({
    message: EnvValidationMessage.DBNameNotRequired
  })
  public MONGO_DB: string;

  @IsString({
    message: EnvValidationMessage.DBHostNotRequired
  })
  public MONGO_HOST: string;

  @IsNumber({}, {
    message: EnvValidationMessage.DBPortNotRequired
  })
  @Min(Port.Min)
  @Max(Port.Max)
  public MONGO_PORT: number;

  @IsString({
    message: EnvValidationMessage.DBUserNotRequired
  })
  public MONGO_USER: string;

  @IsString({
    message: EnvValidationMessage.DBPasswordNotRequired
  })
  public MONGO_PASSWORD: string;

  @IsString({
    message: EnvValidationMessage.DBBaseAuthNotRequired
  })
  public MONGO_AUTH_BASE: string;

  @IsString({
    message: EnvValidationMessage.JWTSecretNotRequired
  })
  public JWT_SECRET: string;

  @IsString({
    message: EnvValidationMessage.JWTSecretExpTimeNotRequired
  })
  public EXP_SECRET_TIME: string;

  @IsString({
    message: EnvValidationMessage.JWTRefreshSecretNotRequired
  })
  public JWT_REFRESH_SECRET: string;

  @IsString({
    message: EnvValidationMessage.JWTRefreshSecretExpTimeNotRequired
  })
  public EXP_REFRESH_SECRET_TIME: string;
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
