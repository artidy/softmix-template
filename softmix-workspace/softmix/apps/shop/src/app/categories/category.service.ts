import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@project-lib/shared-types';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>
  ) {}

  public async findAll(): Promise<Category[]> {
    return await this.repository.find();
  }

  public async findById(id: string): Promise<Category> {
    return this.repository.findOne({ where: { id }});
  }

  public async create(dto: CreateCategoryDto): Promise<Category> {
    const element = this.repository.create({...dto});

    return this.repository.save(element);
  }

  public async update(id: string, dto: UpdateCategoryDto): Promise<Category | null> {
    const element = await this.repository.findOne({ where: { id }});

    return this.repository.save({
      ...element,
      ...dto
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
