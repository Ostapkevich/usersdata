
const poolConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true
}
const connectionConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
}
module.exports={poolConfig,connectionConfig}