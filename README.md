# Viral-backend
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
npm install prisma --save-dev            [insatll prisma and client]
npm install @prisma/client
npx prisma init     [This will create prisma/schema.prisma, .env, prismaconfig.ts]

docker run --name viral-postgres -e POSTGRES_USER=viral_admin -e POSTGRES_PASSWORD=viral123 -e POSTGRES_DB=viral_db -p 5432:5432 -d postgres:16    [To avoid database permission issues]

psql -h localhost -U viral_user -d viral_db [test]

DATABASE_URL="postgresql://viral_admin:viral123@localhost:5432/viral_db"   [.env]

npx prisma migrate dev --name init
npx prisma studio      [prisma studio for GUI of database]

