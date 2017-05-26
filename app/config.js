module.exports = {
  secret: process.env.APP_SECRET || 'keyboard cat',
  email: {
    service: 'gmail',
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASS
    }
  },
  db: {
    userName: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    options: {
      database: process.env.DB,
      encrypt: true
    }
  }
}