import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({ data: { email, password: hashed } });
  }

  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
}