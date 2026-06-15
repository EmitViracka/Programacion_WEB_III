import { DataTypes } from 'sequelize';
import sequelize from '../config/bd.js';

const LogAcceso = sequelize.define('LogAcceso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: { model: 'usuarios', key: 'id' }
    },
    usuario_email: {
        type: DataTypes.STRING(100)
    },
    evento: {
        type: DataTypes.ENUM('ingreso', 'salida'),
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING(50)
    },
    browser: {
        type: DataTypes.STRING(200)
    }
}, {
    tableName: 'logs_acceso',
    timestamps: true,
    createdAt: 'fecha_hora',
    updatedAt: false
});

export default LogAcceso;