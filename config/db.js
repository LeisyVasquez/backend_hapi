const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.HOST_DB, 
    user: process.env.USER_DB, 
    password: process.env.PASS_DB, 
    database: process.env.NAME_DB,
    // Número máximo de clientes que debe contener el pool
    // por defecto se establece en 10.
    max: 20, 
    // Número de milisegundos que un cliente debe permanecer inactivo en el pool y no ser comprobado
    // antes de ser desconectado del backend y descartado
    // por defecto es 10000 (10 segundos) - se ajusta a 0 para desactivar la desconexión automática de los clientes inactivos
    idleTimeoutMillis: 30000,
    // Número de milisegundos a esperar antes de que se agote el tiempo de espera cuando se conecta un nuevo cliente
    // por defecto es 0, lo que significa que no hay tiempo de espera
    connectionTimeoutMillis: 2000
})

module.exports = { pool }