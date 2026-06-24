// require('express-async-errors');
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const rateLimit = require('express-rate-limit');

// const errorHandler = require('./middlewares/errorHandler');

// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const lessonRoutes = require('./routes/lessonRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const enrollmentRoutes = require('./routes/enrollmentRoutes');
// const assignmentRoutes = require('./routes/assignmentRoutes');
// const quizRoutes = require('./routes/quizRoutes');
// const certificateRoutes = require('./routes/certificateRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const aiRoutes = require('./routes/aiRoutes');
// const ragRoutes = require('./routes/ragRoutes');
// const agentRoutes = require('./routes/agentRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// const app = express();

// app.use(helmet({ crossOriginResourcePolicy: false }));


// // ←←← Yeh purani line hata do
// // app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

// // ←←← Is naye code se replace kar do
// app.use(cors({
//   origin: true,                    // Short way for allowing all origins
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'X-Requested-With',
//     'Accept',
//     'Origin'
//   ]
// }));

// // Baaki code same rahega...
// app.use(express.json({ limit: '10mb' }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/', rateLimit({ windowMs: 60_000, max: 200 }));

// app.get('/', (_req, res) => res.json({ name: 'EduForge LMS API', status: 'ok' }));
// app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date() }));

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/assignments', assignmentRoutes);
// app.use('/api/quizzes', quizRoutes);
// app.use('/api/certificates', certificateRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/rag', ragRoutes);
// app.use('/api/agents', agentRoutes);
// app.use('/api/admin', adminRoutes);

// app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));
// app.use(errorHandler);

// module.exports = app;





require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const ragRoutes = require('./routes/ragRoutes');
const agentRoutes = require('./routes/agentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ==================== CORS FIX (Production + Development) ====================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,                    // Render env variable
  'https://mern-eduforge-p5meifkpe-vikash-sharmas-projects-ab292e3a.vercel.app',    // Aapka current Vercel URL
  'https://www.mern-eduforge-lms.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS Blocked Origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie']
}));
// =========================================================================

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', rateLimit({ windowMs: 60_000, max: 200 }));

app.get('/', (_req, res) => res.json({ name: 'EduForge LMS API', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));
app.use(errorHandler);

module.exports = app;