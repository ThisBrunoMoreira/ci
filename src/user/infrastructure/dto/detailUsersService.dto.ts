import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../../shared/infrastructure/repository/search-repository-contracts';
import { DetailUsersService } from '../../application/use_case/detail-users.service';

export class DetailUsersDto implements DetailUsersService.Input {
  @IsNumber()
  @IsOptional()
  page?: number;
  @IsOptional()
  @IsNumber()
  @IsOptional()
  perPage?: number;
  @IsOptional()
  @IsString()
  sort?: string;
  @IsOptional()
  sortDir?: SortDirection;
  @IsString()
  @IsOptional()
  filter?: string;
}
