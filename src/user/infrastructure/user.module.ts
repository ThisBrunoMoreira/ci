import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module';
import { PrismaService } from '../../shared/infrastructure/database/prisma/prisma.service';
import { DetailUserService } from '../application/use_case/detail-user.service';
import { DetailUsersService } from '../application/use_case/detail-users.service';
import { PasswordModificationService } from '../application/use_case/modify-password.service';
import { ModifyUserService } from '../application/use_case/modify-user.service';
import { RemoveUserService } from '../application/use_case/remove-user.service';
import { SignInService } from '../application/use_case/signin.service';
import { SignupService } from '../application/use_case/signup.service';
import { UserRepository } from '../domain/repository/user.repository';
import { BcryptPasswordHasher } from '../provider/hash-provider/bcryptjs-hash-provider';
import { UserPrismaRepository } from './database/prisma/repository/user-prisma.repository';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'hashProvider',
      useClass: BcryptPasswordHasher,
    },
    {
      provide: SignupService.Create,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: BcryptPasswordHasher,
      ) => {
        return new SignupService.Create(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'hashProvider'],
    },
    {
      provide: SignInService.SignIn,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: BcryptPasswordHasher,
      ) => {
        return new SignInService.SignIn(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'hashProvider'],
    },
    {
      provide: RemoveUserService.UserProfile,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new RemoveUserService.UserProfile(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ModifyUserService.UserProfileModification,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ModifyUserService.UserProfileModification(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: PasswordModificationService.passwordModification,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: BcryptPasswordHasher,
      ) => {
        return new SignInService.SignIn(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'hashProvider'],
    },
    {
      provide: DetailUsersService.UsersProfile,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DetailUsersService.UsersProfile(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: DetailUserService.UserProfile,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DetailUserService.UserProfile(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UserModule {}
