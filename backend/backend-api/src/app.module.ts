// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ProvablyFairModule } from './provably-fair/provably-fair.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    WalletModule,
    AuthModule,
    GameModule,
    ProvablyFairModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}