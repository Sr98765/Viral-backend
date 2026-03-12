// src/game/game.service.ts
import { Injectable } from '@nestjs/common';
import { ProvablyFairService } from '../provably-fair/provably-fair.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class GameService {
  constructor(
    private pfService: ProvablyFairService,
    private walletService: WalletService
  ) {}

  async play(userId: number, betAmount: number, seed: string) {
  const wallet = await this.walletService.getBalance(userId);
  if (!wallet) throw new Error('Wallet not found');

  if (wallet.balance < betAmount) throw new Error('Insufficient balance');

  await this.walletService.withdraw(userId, betAmount);

  const { result, hash } = this.pfService.generate(seed);
  const won = result > 50; // simple win if >50
  const payout = won ? betAmount * 2 : 0;

  if (won) await this.walletService.deposit(userId, payout);

  return { result, hash, won, payout };
}
}