# Viral-backend

nvm install 20
nvm use 20
=====================
rm -rf node_modules
rm package-lock.json
npm install
======================

mkdir backend
cd backend

[installing nest globally in backend]
npm install -g @nestjs/cli 
nest new backend-api
cd backend-api

[installing postgresql]
sudo apt update
sudo apt install postgresql postgresql-contrib -y

[start postgresql]
sudo service postgresql start

[check status]
sudo service postgresql status

[switch to postgres system user]
sudo su postgres
psql

[create own database]
CREATE DATABASE viral_db;
CREATE USER viral_user WITH PASSWORD 'viral123';          [database user and password]
GRANT ALL PRIVILEGES ON DATABASE viral_db TO viral_user;     [Giving permissions to access database]
\l [list databases to check]
\q [exit from postgres]
exit [exit from postgres user]

[Test Login]
psql -h localhost -U viral_user -d viral_db 


======================================================
==Prisma==

cd backend-api

npm install prisma@4 --save-dev
npm install @prisma/client@4


==  npm install prisma --save-dev            [insatll prisma and client]
npm install @prisma/client  ======

npx prisma init     [This will create prisma/schema.prisma, .env, prismaconfig.ts]

docker run --name viral-postgres -e POSTGRES_USER=viral_admin -e POSTGRES_PASSWORD=viral123 -e POSTGRES_DB=viral_db -p 5432:5432 -d postgres:16    [To avoid database permission issues]

psql -h localhost -U viral_user -d viral_db [test]

DATABASE_URL="postgresql://viral_admin:viral123@localhost:5432/viral_db"   [.env]

npx prisma migrate dev --name init
npx prisma studio      [prisma studio for GUI of database]

====================================================================================================================
cd /workspaces/Viral-backend/backend/backend-api

nest g module user                    [Generate User module, service, controller]
nest g service user
nest g controller user      

npm install bcrypt jsonwebtoken                [Install authentication dependencies] [bcrypt → hashes passwords, jsonwebtoken → creates JWT tokens]
npm install @types/bcrypt @types/jsonwebtoken --save-dev          


=========================
src/user/user.service.ts
=========================
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}

=============================
src/user/user.controller.ts
=============================
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const user = await this.userService.register(body.email, body.password);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.validateUser(body.email, body.password);
    if (!user) return { error: 'Invalid credentials' };

    const token = jwt.sign({ id: user.id, email: user.email }, 'SECRET_KEY', {
      expiresIn: '1h',
    });

    return { token };
  }
}
====================================================================================
npx prisma generate
npx run start:dev

