# NC News API

A Reddit-style new aggregation API built with Node.js, Express and PostgreSQL
Hosted version - https://jashys-nc-news.onrender.com/api

# Clone repository

jashworth11 / https-github.com-jashworth11-my-northcoders-news-BE
cd northcoders-news-BE

# Setup Instructions

1. Create .env files.
   echo "PGDATABASE=nc_news" > .env.development
   echo "PGDATABASE=nc_news_test" > .env.test
2. 🔧 Database Setup
   npm run setup-dbs # Creates both databases
   npm run seed-dev # Seeds development DB
   npm run test-seed # Seeds test DB
3. 🏃 Running the API
   npm run dev # Starts server on port 9090
4. 🧪 Testing
   npm test # Runs all test suites

# ✨ Features

- Articles with comment counts
- Sorting by votes/date/title
- Topic filtering
- JEST-tested endpoints
- Error handling for 400/404/500 cases

# Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm v8+

# Dependencies

    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "pg": "^8.15.6",
    "pg-format": "^1.0.4",
    "supertest": "^7.1.0"

# Installation

npm install

Test
