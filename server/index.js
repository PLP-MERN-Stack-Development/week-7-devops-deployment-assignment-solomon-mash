const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://8e64de20d37b977917de1566eec61571@o4509671443267584.ingest.de.sentry.io/4509671468302416",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
const bugRoutes = require('./routes/bugRoutes');
const authRoutes = require('./routes/auth'); 
const errorHandler = require('./middleware/errorHandler');


const app = express();
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bugs', bugRoutes);
app.use('/api/auth', authRoutes); 

// Error handling middleware
app.use(errorHandler);
app.use(helmet()); // npm install helmet
app.use(morgan('combined'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => console.error('MongoDB connection failed:', err));

module.exports = app; 
