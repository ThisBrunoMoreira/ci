import { Entity } from '../../domain/entities/entity';
import { SearchResult } from '../../infrastructure/repository/search-repository-contracts';

export type PaginatedItems<Item = unknown> = {
  items: Item[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};

export class PaginatedItemsMapper {
  static toPaginatedItems<Item = unknown>(
    items: Item[],
    SearchResult: SearchResult<Entity<any>>,
  ): PaginatedItems<Item> {
    return {
      items,
      total: SearchResult.total,
      currentPage: SearchResult.currentPage,
      lastPage: SearchResult.lastPage,
      perPage: SearchResult.perPage,
    };
  }
}
