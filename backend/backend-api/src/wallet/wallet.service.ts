// src/wallet/wallet.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: number) {
    return this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deposit(userId: number, amount: number) {
    const wallet = await this.prisma.wallet.upsert({
      where: { userId },
      update: { balance: { increment: amount } },
      create: { userId, balance: amount },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'DEPOSIT',
      },
    });

    return wallet;
  }

  async withdraw(userId: number, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient balance');

    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'WITHDRAW',
      },
    });

    return wallet;
  }
}