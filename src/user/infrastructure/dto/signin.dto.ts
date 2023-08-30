import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignInService } from '../../application/use_case/signin.service';

export class SignInDto implements SignInService.Input {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
