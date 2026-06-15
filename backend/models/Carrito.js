import { DataTypes } from 'sequelize';
import sequelize from '../config/bd.js';

const Carrito = sequelize.define('Carrito', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: { model: 'usuarios', key: 'id' }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        references: { model: 'productos', key: 'id' }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: { min: 1 }
    }
}, {
    tableName: 'carrito',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false
});

export default Carrito;