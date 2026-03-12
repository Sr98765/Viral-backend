// src/provably-fair/provably-fair.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ProvablyFairService } from './provably-fair.service';

@Controller('provably-fair')
export class ProvablyFairController {
  constructor(private readonly pfService: ProvablyFairService) {}

  @Get('roll')
  roll(@Query('seed') seed: string) {
    return this.pfService.generate(seed);
  }
}