// src/provably-fair/provably-fair.module.ts
import { Module } from '@nestjs/common';
import { ProvablyFairService } from './provably-fair.service';

@Module({
  providers: [ProvablyFairService],
  exports: [ProvablyFairService], // <-- export the service for other modules
})
export class ProvablyFairModule {}  // <-- ensure this is exported