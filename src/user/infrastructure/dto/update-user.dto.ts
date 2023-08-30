import { IsNotEmpty, IsString } from 'class-validator';
import { ModifyUserService } from '../../application/use_case/modify-user.service';

export class UpdateUserDto implements Omit<ModifyUserService.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  name: string;
}
