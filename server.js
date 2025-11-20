const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://unpkg.com",
        "https://ajax.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://cdn.plyr.io"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com",
        "https://cdn.plyr.io"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      mediaSrc: [
        "'self'",
        "https:",
        "blob:"
      ],
      connectSrc: [
        "'self'",
        "https:"
      ],
      workerSrc: [
        "'self'",
        "blob:"
      ],
      frameSrc: [
        "'self'"
      ]
    }
  }
}));

// Enable compression
app.use(compression());

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));

// Serve static assets with longer cache
app.use('/static', express.static(path.join(__dirname, 'static'), {
  maxAge: '7d', // Cache assets for 7 days
  etag: true
}));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 LumiTex website is running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log('📝 Press Ctrl+C to stop the server');
});

module.exports = app;
