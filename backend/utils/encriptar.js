import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario';

// Función para validar fortaleza de contraseña
export const validarFortalezaPassword = (password) => {
    let score = 0;
    let mensaje = '';
    let nivel = '';

    // Criterios
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);
    const esLarga = password.length >= 8;
    const esMuyLarga = password.length >= 12;

    if (tieneMinuscula) score++;
    if (tieneMayuscula) score++;
    if (tieneNumero) score++;
    if (tieneEspecial) score++;
    if (esLarga) score++;
    if (esMuyLarga) score++;

    if (password.length < 6) {
        nivel = 'weak';
        mensaje = '❌ Débil - Contraseña muy corta';
    } else if (score <= 2) {
        nivel = 'weak';
        mensaje = '🔴 Débil - Usa mayúsculas, números o caracteres especiales';
    } else if (score === 3 || score === 4) {
        nivel = 'medium';
        mensaje = '🟡 Media - Buena, pero puedes mejorarla';
    } else if (score >= 5) {
        nivel = 'strong';
        mensaje = '🟢 Fuerte - Excelente contraseña';
    }

    return { nivel, mensaje, score };
};

// Encriptar contraseña
export const encriptarPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Verificar contraseña
export const verificarPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const contraseñaCorrecta = await bcrypt.compare(password, Usuario.password);