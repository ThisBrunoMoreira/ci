import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordModificationService } from '../../application/use_case/modify-password.service';

export class PasswordModificationDto
  implements Omit<PasswordModificationService.Input, 'id'>
{
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
