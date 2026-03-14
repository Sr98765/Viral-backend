// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { WalletModule } from '../wallet/wallet.module';
import { ProvablyFairModule } from '../provably-fair/provably-fair.module';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ import PrismaModule
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    WalletModule,
    ProvablyFairModule,
    PrismaModule,   // ✅ This makes PrismaService available to GameService
    AuthModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}