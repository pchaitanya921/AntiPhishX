require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./config/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Database Connection (Restart Triggered 3)
const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';

mongoose
    .connect(DB)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Start Server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`⭐️ Environment: ${process.env.NODE_ENV}`);

    // Masked log for critical env vars
    const mask = (val) => val ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : 'MISSING';
    console.log('📡 Connectivity Matrix:');
    console.log(`   - MongoDB: ${process.env.MONGODB_URI ? 'CONNECTED (URI Hidden)' : 'UNDEFINED'}`);
    console.log(`   - Supabase: ${process.env.SUPABASE_URL || 'UNDEFINED'}`);
    console.log(`   - JWT Secret: ${mask(process.env.JWT_SECRET)}`);
    console.log(`   - Groq API: ${mask(process.env.GROQ_API_KEY)}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
