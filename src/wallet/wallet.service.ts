import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class WalletService {
  async getBalance(userId: number) {
    return prisma.wallet.findUnique({ where: { userId } });
  }

  async deposit(userId: number, amount: number) {
    return prisma.wallet.upsert({
      where: { userId },
      update: { balance: { increment: amount } },
      create: { userId, balance: amount },
    });
  }

  async withdraw(userId: number, amount: number) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');

    return prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
  }
}