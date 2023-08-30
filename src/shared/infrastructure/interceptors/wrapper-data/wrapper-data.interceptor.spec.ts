import { of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;
  let props: any;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
    props = {
      name: 'any_name',
      email: 'any@any.com',
      password: 'any_password',
    };
  });
  it('should be defined', () => {
    expect(new WrapperDataInterceptor()).toBeDefined();
  });
  it('should wrapper with data', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });
    obs$.subscribe({
      next: (value) => {
        expect(value).toEqual({ data: props });
      },
    });
  });
  it('should not wrapper when meta key is present', () => {
    const result = { data: [props], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$.subscribe({
      next: (value) => {
        expect(value).toEqual(result);
      },
    });
  });
});
