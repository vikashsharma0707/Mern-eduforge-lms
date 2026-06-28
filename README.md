# EduForge - AI-Powered Learning Management System

**Full-Stack MERN + AI + DevOps** based Production-ready LMS Platform inspired by Unacademy, Udemy & Coursera.

![Banner](./assets/banner.png)  
*(Add a nice banner image here)*

## Live Demo
- **Frontend**: [eduforge.live](https://your-frontend-url.vercel.app) *(update kar dena)*
- **Backend API**: [api.eduforge.live](https://your-api-url.onrender.com)
- **Admin Panel**: Available after login as admin

## Features

### Student Features
- Browse & enroll in courses
- Video learning player with progress tracking
- Interactive quizzes & assignments
- AI Tutor & Chat with PDF documents (RAG)
- View certificates & learning roadmap
- Real-time progress dashboard

### Teacher Features
- Create & manage own courses, lessons & quizzes
- Upload videos, PDFs & study materials
- View enrolled students & their progress
- Assignment review & grading

### Admin Features
- Complete user & course management
- Platform analytics & statistics
- Category & content moderation
- User activation/deactivation

### AI Features (Highlight Point)
- **AI Tutor** with multiple modes: Tutor, Quiz Generator, Assignment Generator, Study Notes, Resume Builder, Interview Questions, Coding Mentor, Learning Roadmap
- **RAG System** – Chat with your uploaded PDFs/DOCX
- Context-aware responses using Llama 3.1 & other models via OpenRouter

## Tech Stack

**Frontend**
- React.js + Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify
- Socket.IO Client (Real-time)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication + bcryptjs
- Multer (File Uploads)
- Razorpay Payment Gateway

**AI & RAG**
- OpenRouter (Llama 3.1, DeepSeek, GPT-compatible)
- PDF/DOCX text extraction + Chunking + Embeddings
- Vector Search & Context Retrieval

**DevOps**
- Docker + docker-compose
- Kubernetes (Deployment, Service, Ingress)
- GitHub Actions CI/CD
- MongoDB Atlas

## Architecture
Client (React + Redux)
↓ (Axios)
API Gateway (Express)
↓
Controllers → Services → MongoDB
↓
OpenRouter AI + RAG Pipeline
↓
Razorpay Payment + Certificate Generation
text## Folder Structure
eduforge/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── uploads/
├── kubernetes/             # K8s manifests
├── .github/workflows/      # CI/CD
├── docker-compose.yml
└── README.md
text## Environment Variables
**Backend (.env)**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_key
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
Frontend (.env)
envVITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=...
Installation & Setup
Bashgit clone https://github.com/vikashsharma0707/eduforge.git
cd eduforge

# Backend
cd server
npm install
cp .env.example .env
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
Docker Setup
Bashdocker-compose up --build
Kubernetes Deployment
Bashkubectl apply -f kubernetes/
kubectl get pods
kubectl get svc
API Endpoints (Important)
Auth

POST /api/auth/register
POST /api/auth/login

Courses

GET /api/courses
POST /api/courses (Teacher)

AI

POST /api/ai/chat
POST /api/ai/rag (Chat with PDF)

Payments

POST /api/payments/create-order
POST /api/payments/verify

Security & Performance

JWT + Role Based Access Control (RBAC)
Helmet, CORS, Rate Limiting
Password Hashing (bcrypt)
Protected Routes
Input Validation & Error Handling

Resume One-Liner
Built a production-ready AI-powered Learning Management System using MERN Stack, OpenRouter LLMs, RAG architecture, Docker, Kubernetes & Razorpay with role-based dashboards, AI tutoring, document intelligence & scalable cloud deployment.
Author
Vikash Sharma
GitHub | LinkedIn | Portfolio
License
MIT License