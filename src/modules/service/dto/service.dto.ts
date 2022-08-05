import {Expose} from 'class-transformer';

class ServiceDto {
  @Expose()
  public id!: number;

  @Expose()
  public title!: string;

  @Expose()
  public preview!: string;

  @Expose()
  public description!: string;
}

export default ServiceDto;
