import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternalService } from '@project-lib/shared-types';

import { ExternalServiceEntity } from './external-service.entity';
import { EncryptionService } from './encryption.service';

@Injectable()
export class ExternalServicesService implements OnModuleInit {
  private readonly logger = new Logger(ExternalServicesService.name);

  constructor(
    @InjectRepository(ExternalServiceEntity)
    private readonly repository: Repository<ExternalServiceEntity>,
    private readonly encryption: EncryptionService,
  ) {}

  async onModuleInit() {
    await this.migrateExistingTokens();
  }

  private async migrateExistingTokens(): Promise<void> {
    const services = await this.repository.find();

    for (const service of services) {
      if (service.authToken && !this.encryption.isEncrypted(service.authToken)) {
        this.logger.log(`Шифрование токена сервиса "${service.name}"...`);
        service.authToken = this.encryption.encrypt(service.authToken);
        await this.repository.save(service);
      }
    }
  }

  private maskToken(service: ExternalService): ExternalService {
    return {
      ...service,
      authToken: service.authToken ? EncryptionService.MASKED_VALUE : '',
    };
  }

  public async findAll(): Promise<ExternalService[]> {
    const services = await this.repository.find({ order: { createdAt: 'DESC' } });
    return services.map((s) => this.maskToken(s));
  }

  public async findById(id: string): Promise<ExternalService> {
    const service = await this.repository.findOneBy({ id });

    if (!service) {
      throw new NotFoundException(`Сервис с id ${id} не найден`);
    }

    return this.maskToken(service);
  }

  public async findByName(name: string): Promise<ExternalService> {
    const service = await this.repository.findOneBy({ name });

    if (!service) {
      throw new NotFoundException(`Сервис "${name}" не найден`);
    }

    return {
      ...service,
      authToken: service.authToken ? this.encryption.decrypt(service.authToken) : '',
    };
  }

  public async findActive(): Promise<ExternalService[]> {
    const services = await this.repository.find({ where: { isActive: true }, order: { name: 'ASC' } });
    return services.map((s) => this.maskToken(s));
  }

  public async create(dto: Partial<ExternalService>): Promise<ExternalService> {
    if (dto.authToken) {
      dto.authToken = this.encryption.encrypt(dto.authToken);
    }

    const entity = this.repository.create(dto);
    return this.maskToken(await this.repository.save(entity));
  }

  public async update(id: string, dto: Partial<ExternalService>): Promise<ExternalService> {
    const service = await this.repository.findOneBy({ id });

    if (!service) {
      throw new NotFoundException(`Сервис с id ${id} не найден`);
    }

    if (dto.authToken && dto.authToken !== EncryptionService.MASKED_VALUE) {
      dto.authToken = this.encryption.encrypt(dto.authToken);
    } else {
      delete dto.authToken;
    }

    return this.maskToken(await this.repository.save({ ...service, ...dto }));
  }

  public async delete(id: string): Promise<void> {
    const service = await this.repository.findOneBy({ id });

    if (!service) {
      throw new NotFoundException(`Сервис с id ${id} не найден`);
    }

    await this.repository.delete(id);
  }
}
