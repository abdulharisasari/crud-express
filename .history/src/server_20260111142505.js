require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

(async () => {
  try {
    await sequelize.authenticate();
    
    // Development: drop & recreate tables
    // Production: just sync without dropping
    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✓ Database synced (development mode - alter tables)');
    } else {
      await sequelize.sync();
      console.log('✓ Database synced (production mode)');
    }

    console.log(`✓ Database connected (${NODE_ENV})`);

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} [${NODE_ENV.toUpperCase()}]`);
    });
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
})();
