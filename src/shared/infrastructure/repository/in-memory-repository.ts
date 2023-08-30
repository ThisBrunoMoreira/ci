import { Entity } from '../../domain/entities/entity';
import { NotFoundError } from '../../domain/erros/not-found-error';
import { RepositoryInterface } from './repository-contracts';

export abstract class InMemoryRepository<E extends Entity<any>>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  protected async getByIdOrFail(id: string): Promise<E> {
    const _id = `${id}`;
    const entity = this.items.find((item) => item.id === _id);
    if (!entity) {
      throw new NotFoundError('Entity not found');
    }
    return entity;
  }

  async create(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findOne(id: string): Promise<E> {
    return this.getByIdOrFail(id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this.getByIdOrFail(entity.id);
    const index = this.items.findIndex((item) => item.id === entity.id);
    this.items[index] = entity;
  }

  async remove(id: string): Promise<void> {
    await this.getByIdOrFail(id);
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1);
  }
}
