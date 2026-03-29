require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example API Route to fetch store configurations
app.get('/api/store-info', async (req, res) => {
  try {
    // Note: This will fail until the database is migrated and populated
    const stores = await prisma.storeLocation.findMany({
      include: {
        regularHours: true,
        holidayHours: true
      }
    });
    
    res.json(stores);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to fetch store configurations', details: error.message });
  }
});

// Example Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running correctly.' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'Missing in .env'}`);
});
