import { IsNotEmpty, IsString } from 'class-validator';
import { RemoveUserService } from '../../application/use_case/remove-user.service';

export class RemoveDto implements RemoveUserService.Input {
  @IsString()
  @IsNotEmpty()
  id: string;
}
