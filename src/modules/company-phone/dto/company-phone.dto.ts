import {Expose} from 'class-transformer';

class CompanyPhoneDto {
  @Expose()
  public id!: number;

  @Expose({name: 'phone_number'})
  public phoneNumber!:string;

  @Expose({name: 'is_main'})
  public isMain!: boolean;
}

export default CompanyPhoneDto;
