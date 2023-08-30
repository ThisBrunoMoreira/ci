import { IsNotEmpty, IsString } from 'class-validator';
import { DetailUserService } from '../../application/use_case/detail-user.service';

export class DetailUserDto implements DetailUserService.Input {
  @IsString()
  id: string;
}
