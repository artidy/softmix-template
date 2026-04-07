import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable, ManyToOne
} from 'typeorm';
import { Category } from '@project-lib/shared-types';
import { ProductEntity } from '../products/product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity implements Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @OneToMany(() => ProductEntity, (product) => product.category,
    { onDelete: 'CASCADE' })
  @JoinTable()
  products: ProductEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.categories)
  @JoinTable({ name: 'owner_id' })
  owner: CategoryEntity;

  @Column({ name: 'owner_id', default: null })
  ownerId: string;

  @Column({ default: 0 })
  position: number;

  @OneToMany(() => CategoryEntity, (category) => category.owner,
    { onDelete: 'CASCADE' })
  @JoinTable()
  categories: CategoryEntity[];

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
