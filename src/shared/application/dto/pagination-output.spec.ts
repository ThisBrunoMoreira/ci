import { SearchResult } from '../../infrastructure/repository/search-repository-contracts';
import { PaginatedItemsMapper } from './pagination-output.dto';

describe('PaginationOutputMapper unit tests', () => {
  it('should correctly map a SearchResult to paginated output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDir: '',
      filter: 'fake',
    });
    const sut = PaginatedItemsMapper.toPaginatedItems(result.items, result);
    expect(sut).toStrictEqual({
      items: ['fake'],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });
});
