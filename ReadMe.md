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

Backend base URL:
- http://localhost:5000

## 6. Start the Frontend

In terminal 2:

  cd /home/gabriel/Desktop/AstonCv/frontend
  npm start


Press Ctrl+C in each terminal running:
- backend node app.js
- frontend npm start
