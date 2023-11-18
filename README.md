 1. run `yarn install`
 2. create .env file and paste .env.example content
 3a. update schema/schema.prisma
        datasource db {
        provider = "cockroachdb"

        url = env("DATABASE_URL")
        }

 3. run `npx prisma migrate dev`    if we remove /prisma/migration, this is reset the db
 4. run `yarn start:dev` or `nohup yarn start:dev > ./logs/server-out.log 2>&1 &`
 5. access swagger 'http://localhost:3000/api'
