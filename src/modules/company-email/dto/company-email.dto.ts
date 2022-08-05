import {Expose} from 'class-transformer';

class CompanyEmailDto {
  @Expose()
  public id!: number;

  @Expose()
  public email!: string;

  @Expose({ name: 'is_main' })
  public isMain!: boolean;
}

export default CompanyEmailDto;
