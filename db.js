const Sequelize = require('sequelize')

databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(databaseUrl)

sequelize
  .sync()
  .then(() => console.log('Database schema updated'))
  .catch(console.error)

  module.exports = sequelize 