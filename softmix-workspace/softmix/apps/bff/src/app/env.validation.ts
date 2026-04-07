import { IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvValidationMessage } from '@project-lib/core';

class EnvironmentsConfig {
  @IsString({
    message: EnvValidationMessage.URLServiceNotRequired
  })
  public USERS_URL: string;

  @IsString({
    message: EnvValidationMessage.URLServiceNotRequired
  })
  public SHOP_URL: string;

  @IsString({
    message: EnvValidationMessage.URLServiceNotRequired
  })
  public UPLOADER_URL: string;

  @IsString({
    message: EnvValidationMessage.URLServiceNotRequired
  })
  public AL_STYLE_URL: string;

  @IsString({
    message: EnvValidationMessage.URLServiceNotRequired
  })
  public AL_STYLE_TOKEN: string;

  @IsString({
    message: EnvValidationMessage.URLServiceNotRequired
  })
  public AUTH_SERVICE_URL: string;
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
