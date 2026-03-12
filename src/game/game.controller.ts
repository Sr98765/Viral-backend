// src/game/game.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('play')
  async play(@Req() req, @Body() body: { amount: number; seed: string }) {
    const userId = req.user.id;
    return this.gameService.play(userId, body.amount, body.seed);
  }
}