const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imagedb',
  password: 'pulifuas@143',
  port: 5432,
})

module.exports = db;