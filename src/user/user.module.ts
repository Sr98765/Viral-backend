import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt'; // ✅ import JwtModule
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // put in .env for production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // if Wallet or other modules need it
})
export class UserModule {}