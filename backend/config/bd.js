import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'tienda_vka',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export const conectarDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(' Base de datos conectada');
        await sequelize.sync({ alter: false });
        console.log(' Modelos sincronizados');
    } catch (error) {
        console.error(' Error de conexión:', error);
        process.exit(1);
    }
};

export default sequelize;