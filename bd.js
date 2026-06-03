const mysql = require('mysql2');
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda'
});

conexion.connect((err) => {
    if (err) {
        console.log('Error de conexión');
    } else {
        console.log('Conectado a MySQL');
    }
});

module.exports = conexion;