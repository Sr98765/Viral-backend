# Viral-backend

nvm install 22
=====================
nvm use 22
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

\c viral_db
GRANT ALL PRIVILEGES ON SCHEMA public TO viral_user;

\l [list databases to check]
\q [exit from postgres]
exit [exit from postgres user]

[Test Login]
psql -h localhost -U viral_user -d viral_db 
(Enter password)

======================================================
==Prisma==

cd backend-api

npm install prisma@4 --save-dev
npm install @prisma/client@4


npx prisma init     [This will create prisma/schema.prisma, .env, prismaconfig.ts]
========================================================================================

DATABASE_URL="postgresql://viral_user:viral123@localhost:5432/viral_db"  [.env]

======================
[In schema.prisma]

model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String?
}
======================

sudo su postgres
psql
ALTER USER viral_user CREATEDB;

npx prisma generate
(or)
npx prisma db push

npx prisma migrate dev --name init

npx prisma studio      [prisma studio for GUI of database]
===========================================================================================================================================================================
===========================================================================================================================================================================


npx nest generate service prisma
=================
prisma.service.ts
=================
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  // This connects to the database when the app starts
  async onModuleInit() {
    await this.$connect();
  }

  // This closes the connection when the app stops
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
==============================


npx nest generate controller users
============================
src/user/user.controller.ts
================================
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Create a user (POST http://localhost:3000/users)
  @Post()
  async createUser(@Body() data: { email: string; name?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
      },
    });
  }

  // 2. Get all users (GET http://localhost:3000/users)
  @Get()
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
=================
Make sure Prisma is in app.module.ts
Open src/app.module.ts and ensure PrismaService is in the providers list:

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
======================================================================================
npm run start:dev




curl -X POST http://localhost:3000/users   -H "Content-Type: application/json"   -d '{"email": "user1@viral.com", "name": "Viral User"}'



npx run start:dev
npx prisma studio





====================================================================================================================

====================================================================================================================
                             auth-service
=====================================================================================================================  



nvm use 22
node -v
==================
cd /workspaces/backend-revise/backend
ls
==================
nest new auth-service          [npm]
==================
[Install Auth dependencies]
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
=======================================================================
prisma
---------
npm install prisma@4 --save-dev
npm install @prisma/client@4

npx prisma init
=============================

DATABASE_URL="postgresql://viral_user:viral123@localhost:5432/viral_db"               [.env]

========================
[prisma/schema.prisma]
--------------------------
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

====================================================
npx prisma generate
======================

npx nest g service prisma
--------------------
[src/prisma/prisma.service.ts]

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
============================
npx nest g module auth
npx nest g service auth
npx nest g controller auth
-----------------------
[src/auth/auth.module.ts]

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  imports: [
    JwtModule.register({
      secret: 'viral_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}

===================================
[src/auth/auth.service.ts]

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {

    const hashed = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    })

    return { id: user.id, email: user.email }
  }

  async login(email: string, password: string) {

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new Error('User not found')

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) throw new Error('Invalid password')

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    })

    return { token }
  }
}
==============================
[src/auth/auth.controller.ts]

import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password)
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password)
  }

}
======================================

[src/main.ts]

async function bootstrap() {

  const app = await NestFactory.create(AppModule)

  app.enableCors()

  await app.listen(3001)

}
bootstrap()
=============================

npm run start:dev
npx prisma studio
==========================
[Register]

curl -X POST http://localhost:3001/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"test@viral.com","password":"123456"}'

[Login]

curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@viral.com","password":"123456"}'

===========================================================================================================================================


