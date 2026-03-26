# AstonCV - Local Setup and Run Guide

This document explains how to start AstonCV from scratch on a local machine.

## 1. Prerequisites

Install these tools first:
- Node.js 18+ and npm
- MySQL 8+

Check versions:

Node.js
  node -v

npm
  npm -v

MySQL
  mysql --version

## 2. Install Dependencies

Open a terminal in the project root and install backend/root dependencies:

  cd /home/gabriel/Desktop/AstonCv
  npm install

Install frontend dependencies:

  cd /home/gabriel/Desktop/AstonCv/frontend
  npm install

## 3. Configure Backend Environment

Create backend environment file:

  cd /home/gabriel/Desktop/AstonCv/backend
  cp .env.example .env

Edit backend/.env and set your MySQL values. Example:

  DB_HOST=localhost
  DB_USER=astoncv_user
  DB_PASSWORD=yourStrongPassword
  DB_NAME=astoncv
  JWT_SECRET=replace_with_a_long_random_secret

Important:
- JWT_SECRET must not be empty
- Use a strong random secret for JWT_SECRET

## 4. Create Database and Tables

Run the schema SQL file:

  cd /home/gabriel/Desktop/AstonCv/backend
  mysql -h localhost -u astoncv_user -p astoncv < sql/cvs.sql

If your MySQL user is different, replace astoncv_user and database name accordingly.

This creates:
- users table
- cvs table

## 5. Start the Backend API

In terminal 1:

  cd /home/gabriel/Desktop/AstonCv/backend
  node app.js

Expected output includes:
- Server running on port 5000
- MySQL Connected

Backend base URL:
- http://localhost:5000

## 6. Start the Frontend

In terminal 2:

  cd /home/gabriel/Desktop/AstonCv/frontend
  npm start

Frontend URL:
- http://localhost:3000

The frontend API client is configured to call:
- http://localhost:5000/api

## 7. Verify Everything Works

1. Open http://localhost:3000
2. Go to Register page
3. Create a test account
4. Confirm no backend 500 error appears

## 8. Common Errors and Fixes

### Error: Missing JWT_SECRET in backend/.env
Cause:
- JWT_SECRET is empty or backend/.env is missing

Fix:
- Set JWT_SECRET in backend/.env with a non-empty value

### Error: 500 Registration failed
Cause:
- Database tables were not created

Fix:
- Import schema again:

  cd /home/gabriel/Desktop/AstonCv/backend
  mysql -h localhost -u astoncv_user -p astoncv < sql/cvs.sql

### Error: 400 Bad Request on /api/auth/register
Cause:
- Validation failed

Rules:
- name is required
- email must be valid
- password must be at least 6 characters

### Error: net::ERR_CONNECTION_REFUSED on :5000
Cause:
- Backend server is not running

Fix:
- Start backend in backend folder with node app.js

## 9. Stop the App

Press Ctrl+C in each terminal running:
- backend node app.js
- frontend npm start
