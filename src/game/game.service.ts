import { Injectable } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { ProvablyFairService } from '../provably-fair/provably-fair.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {

  constructor(
    private walletService: WalletService,
    private pfService: ProvablyFairService,
    private prisma: PrismaService,
  ) {}

  async play(userId: number, betAmount: number, seed: string) {

    const balance = await this.walletService.getBalance(userId);

    if (!balance || balance.balance < betAmount) {
      throw new Error('Insufficient balance');
    }

    await this.walletService.withdraw(userId, betAmount);

    const { result, hash } = this.pfService.generate(seed);

    const won = result > 50;
    const payout = won ? betAmount * 2 : 0;

    if (won) {
      await this.walletService.deposit(userId, payout);
    }

    await this.prisma.gameRound.create({
      data: {
        userId,
        betAmount,
        result,
        payout,
        hash,
      },
    });

    return {
      result,
      hash,
      won,
      payout,
    };
  }
}