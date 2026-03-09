require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const compileRoutes = require('./routes/compileRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect Database
connectDB();

const app = express();

app.use(cors({
    origin: '*', // In strict production, replace '*' with your Vercel frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api', compileRoutes);
app.use('/api', aiRoutes);

app.get('/', (req, res) => {
    res.send('AI C Compiler API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
