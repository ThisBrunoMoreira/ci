import { Entity } from '../../domain/entities/entity';

export interface RepositoryInterface<E extends Entity<any>> {
  create(entity: E): Promise<void>;
  findOne(id: string): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  remove(id: string): Promise<void>;
}
