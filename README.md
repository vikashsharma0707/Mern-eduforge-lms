# EduForge - AI-Powered LMS (MERN Stack)

Production-ready Learning Management System inspired by PW, Unacademy, Udemy & Coursera.

## Stack
- **Frontend**: React 18 (JSX), React Router v6, Redux Toolkit, Axios, External CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer
- **AI**: OpenRouter API (LLM), RAG (chunking + embeddings + retrieval), Agentic AI
- **Payments**: Razorpay

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, OPENROUTER_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm run dev
```
Server runs on http://localhost:5000

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api and VITE_RAZORPAY_KEY_ID
npm run dev
```
Client runs on http://localhost:5173

## Roles
- **Admin** — full platform management
- **Teacher** — create courses, lessons, assignments, quizzes
- **Student** — enroll, learn, take quizzes, get certificates, chat with AI

## Default Admin
Register a user, then in MongoDB set `role: "admin"` on that user document — or use the seed script:
```bash
cd server && node utils/seedAdmin.js
```
Creates admin@eduforge.io / Admin@123

## AI Features
All AI calls go through OpenRouter. Set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` (default `meta-llama/llama-3.1-8b-instruct:free`).

- AI Chat Assistant (tutor)
- Notes Generator
- Quiz Generator
- Assignment Generator
- Resume Builder
- Career Roadmap Generator
- Interview Question Generator
- Coding Mentor

## RAG
Upload PDF / DOCX / TXT → chunked → embedded (OpenRouter embeddings or local hash-based fallback) → stored in MongoDB → retrieved via cosine similarity → injected into prompt.

## Agentic AI
Multi-step agents that plan → act → observe → respond:
- Study Planner Agent
- Career Agent
- Interview Agent
- Assignment Evaluation Agent
- Coding Mentor Agent
- Learning Recommendation Agent
- Revision Agent

## Payments (Razorpay)
- Create order → `/api/payments/create-order`
- Verify signature → `/api/payments/verify`
- Webhook → `/api/payments/webhook`

## Folder Structure
See `client/` and `server/` directories.
