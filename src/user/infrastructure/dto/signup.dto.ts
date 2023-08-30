import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignupService } from '../../application/use_case/signup.service';

export class SignupDto implements SignupService.Input {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
