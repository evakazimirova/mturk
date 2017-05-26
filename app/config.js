let localConf = {};

try {
  localConf = require('./configLoвcal.json');
} catch (error) {}

module.exports = {
  secret: process.env.APP_SECRET || 'keyboard cat',
  email: {
    service: 'gmail',
    auth: {
      user: process.env.MAILER_EMAIL || localConf.email,
      pass: process.env.MAILER_PASS || localConf.emailPass
    }
  },
  db: {
    userName: process.env.DB_USER || localConf.dbUser,
    password: process.env.DB_PASS || localConf.dbPassword,
    server: process.env.DB_SERVER || localConf.dbServer,
    options: {
      database: process.env.DB || localConf.db,
      encrypt: true
    }
  }
}