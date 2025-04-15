# NC News Seeding

Create .env.test for the test database
Create .env.development for the development database
.env.test should contain PGDATABASE=your_test_db_name
.env.development should contain PGDATABASE=your_dev_db_name
Run npm run setup-dbs to create the databases
Run npm run test-seed to verify test database connection
Run npm run seed-dev to verify development database connection
Double check gitignore folder contains .env.\*
