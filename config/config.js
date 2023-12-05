require("dotenv").config();
const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_NAME, DB_DIALECT } = process.env;

module.exports = {
    development: {
        username: 'root',
        password: 'your_password',
        database: 'your_database',
        host: 'localhost',
        dialect: 'mysql' // atau jenis database lainnya seperti 'postgres', 'sqlite', 'mssql', dll.
    },
    production: {
        // Konfigurasi untuk lingkungan produksi
    },
    test: {
        // Konfigurasi untuk lingkungan pengujian (testing)
    }
};
