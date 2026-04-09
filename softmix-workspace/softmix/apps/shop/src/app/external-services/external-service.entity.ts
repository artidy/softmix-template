import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthType, ExternalService, ExternalServiceHeader } from '@project-lib/shared-types';

@Entity({ name: 'external_services' })
export class ExternalServiceEntity implements ExternalService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'base_url' })
  baseUrl: string;

  @Column({ name: 'base_path', default: '' })
  basePath: string;

  @Column({ name: 'auth_type', type: 'varchar', default: AuthType.None })
  authType: AuthType;

  @Column({ name: 'auth_token', default: '' })
  authToken: string;

  @Column({ name: 'auth_param_name', default: '' })
  authParamName: string;

  @Column({ type: 'jsonb', default: '[]' })
  headers: ExternalServiceHeader[];

  @Column({ default: 15000 })
  timeout: number;

  @Column({ name: 'forward_headers', default: false })
  forwardHeaders: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', default: '' })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
