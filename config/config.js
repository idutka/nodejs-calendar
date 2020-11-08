require('dotenv').config();

const args = process.argv.slice(2);

const data = {};

args.forEach((item) => {
    const [key, value] = item.split('=')
    data[key.substr(1)] = value
});

const PORT = parseInt(process.env.PORT) || 3000
const ENV = data.env || 'development';

module.exports.PORT = PORT;
module.exports.ENV = ENV;

const DB_DIALECT = 'postgres';
const DB_PORT = 5432;

const db = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: DB_DIALECT,
        port: DB_PORT
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: DB_DIALECT,
        port: DB_PORT
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: DB_DIALECT,
        port: DB_PORT
    }
}

module.exports.development = db.development;
module.exports.test = db.test;
module.exports.production = db.production;
