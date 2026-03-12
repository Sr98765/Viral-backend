import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { ProvablyFairService } from './provably-fair/provably-fair.service';
import { ProvablyFairController } from './provably-fair/provably-fair.controller';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';

@Module({
  imports: [UserModule, WalletModule, AuthModule],
  controllers: [AppController, ProvablyFairController, GameController],
  providers: [AppService, ProvablyFairService, GameService],
})
export class AppModule {}
