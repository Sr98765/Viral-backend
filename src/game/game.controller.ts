// src/game/game.controller.ts
import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('play')
  async play(
    @Req() req: RequestWithUser,
    @Body() body: { betAmount: number; seed: string },
  ) {
    return this.gameService.play(req.user.id, body.betAmount, body.seed);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async history(@Req() req: RequestWithUser) {
    return this.gameService.getGameRounds(req.user.id);
  }
}