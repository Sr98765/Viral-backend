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
CREATE USER viral_user WITH PASSWORD 'viral123'; [database user and password]
GRANT ALL PRIVILEGES ON DATABASE viral_db TO viral_user;  [Giving permissions to access database]
\l [list databases to check]
\q [exit from postgres]
exit [exit from postgres user]

[Test Login]
psql -h localhost -U viral_user -d viral_db 
