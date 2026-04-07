import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteSettings } from '@project-lib/shared-types';

import { SettingsEntity } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly repository: Repository<SettingsEntity>,
  ) {}

  public async get(): Promise<SiteSettings> {
    const settings = await this.repository.find();

    if (settings.length === 0) {
      const defaultSettings = this.repository.create({});
      return this.repository.save(defaultSettings);
    }

    return settings[0];
  }

  public async update(dto: Partial<SiteSettings>): Promise<SiteSettings> {
    const settings = await this.get();
    return this.repository.save({ ...settings, ...dto });
  }
}
