import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Product } from '@project-lib/shared-types';

import { CategoryEntity } from '../categories/category.entity';

@Entity({ name: 'products' })
export class ProductEntity implements Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ name: 'price_prev'})
  pricePrev: number;

  @Column({ name: 'image_url', default: ''})
  imageUrl: string;

  @Column()
  description: string;

  @Column({ default: 0})
  discount: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ name: 'category_id'})
  categoryId: string;

  @Column({ name: 'is_hot'})
  isHot: boolean;

  @Column({ name: 'download_id', default: 0 })
  downloadId: number;

  @Column({ name: 'download_company', default: ''})
  downloadCompany: string;

  @CreateDateColumn({
    name: 'created_at',
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updatedAt: Date;
}
