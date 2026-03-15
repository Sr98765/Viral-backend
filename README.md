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










====================================================================================================================

====================================================================================
npx prisma generate
npx run start:dev

