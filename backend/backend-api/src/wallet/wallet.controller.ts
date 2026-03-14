// src/wallet/wallet.controller.ts
import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('balance')
  async balance(@Req() req: Request) {
    return this.walletService.getBalance(req.user!.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('deposit')
  async deposit(@Req() req: Request, @Body() body: { amount: number }) {
    return this.walletService.deposit(req.user!.id, body.amount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('withdraw')
  async withdraw(@Req() req: Request, @Body() body: { amount: number }) {
    return this.walletService.withdraw(req.user!.id, body.amount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transactions')
  async transactions(@Req() req: Request) {
    return this.walletService.getTransactions(req.user!.id);
  }
}