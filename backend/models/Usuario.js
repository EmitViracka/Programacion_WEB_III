// backend/models/Usuario.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/bd.js';
import bcrypt from 'bcryptjs';

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    rol: { type: DataTypes.ENUM('admin', 'usuario'), defaultValue: 'usuario' },
    password_strength: { type: DataTypes.STRING(20) }
}, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Método para validar contraseña
Usuario.prototype.validarPassword = async function(password) {
    console.log('  Validando contraseña en modelo:');
    console.log('   Password ingresada:', password);
    console.log('   Hash almacenado:', this.password);
    const result = await bcrypt.compare(password, this.password);
    console.log('   Resultado:', result);
    return result;
};

// Hook para encriptar contraseña antes de guardar
Usuario.beforeCreate(async (usuario) => {
    if (usuario.password) {
        console.log('  Encriptando en beforeCreate...');
        console.log('   Password original:', usuario.password);
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
        console.log('   Hash generado:', usuario.password);
        console.log('   Longitud:', usuario.password.length);
    }
});

export default Usuario;