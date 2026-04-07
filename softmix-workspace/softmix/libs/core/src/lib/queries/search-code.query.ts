import { SearchQuery } from '@project-lib/shared-types';
import { IsOptional, IsString } from 'class-validator';

export class SearchCodeQuery implements SearchQuery {
  @IsString()
  @IsOptional()
  public search: string;
}
