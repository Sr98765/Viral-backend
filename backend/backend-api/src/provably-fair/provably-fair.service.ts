// src/provably-fair/provably-fair.service.ts
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as crypto from 'crypto';

@Injectable()
export class ProvablyFairService {
  generate(seed: string) {
    const random = parseInt(crypto.createHash('sha256').update(seed).digest('hex'), 16);
    const result = (random % 100) + 1; // 1-100
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    return { result, hash };
  }
}