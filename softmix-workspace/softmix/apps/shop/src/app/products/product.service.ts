import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductsPaginationApi } from '@project-lib/shared-types';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import ProductQuery from './queries/product.query';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  public async findAll(query: ProductQuery): Promise<ProductsPaginationApi> {
    const {isHot, categoryId, page, limit, isNew} = query;
    const skip = (page - 1) * limit;
    const [products, total] = await this.repository.findAndCount(
      { where: { isHot, categoryId },
        take: limit,
        skip: skip,
        relations: ['category'], // Load category to avoid N+1 query problem
        order: {
          createdAt: 'ASC'
        }
      });

    return {
      products,
      total,
    }
  }

  public async findById(id: string): Promise<Product> {
    return this.repository.findOne({ where: { id }, relations: ['category']});
  }

  public async create(dto: CreateProductDto): Promise<Product> {
    const element = this.repository.create({...dto});

    return this.repository.save(element);
  }

  public async createMany(dto: CreateProductDto[]): Promise<Product[]> {
    const elements = dto.map((dtoElement) => this.repository.create({...dtoElement}));

    return this.repository.save(elements);
  }

  public async update(id: string, dto: UpdateProductDto): Promise<Product | null> {
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
