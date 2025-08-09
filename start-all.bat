@echo off
concurrently "cd backend && nodemon index.js" "cd frontend && npm run dev"