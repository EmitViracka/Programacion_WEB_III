import Usuario from '../models/Usuario.js';
import LogAcceso from '../models/LogAcceso.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_tienda_2024';

// Validar fortaleza de contraseña
const validarFortalezaPassword = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) return { nivel: 'Débil', color: '#dc3545' };
    if (score <= 4) return { nivel: 'Intermedia', color: '#ffc107' };
    return { nivel: 'Fuerte', color: '#28a745' };
};

// GET - CAPTCHA (mantener en memoria por simplicidad)
let captchaStore = {};

export const getCaptcha = (req, res) => {
    const svgCaptcha = require('svg-captcha');
    const captcha = svgCaptcha.create({ size: 6, noise: 2, color: true, background: '#f0f0f0', width: 150, height: 50 });
    const captchaId = Date.now().toString();
    captchaStore[captchaId] = captcha.text;
    setTimeout(() => delete captchaStore[captchaId], 5 * 60 * 1000);
    res.setHeader('X-Captcha-Id', captchaId);
    res.type('svg');
    res.send(captcha.data);
};

// POST - Registro
export const registrar = async (req, res) => {
    try {
        const { nombre, email, password, captcha, captchaId } = req.body;
        const id = captchaId || req.headers['x-captcha-id'];
        
        if (!captchaStore[id] || captcha !== captchaStore[id]) {
            return res.status(400).json({ error: 'CAPTCHA incorrecto' });
        }
        delete captchaStore[id];
        
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) return res.status(400).json({ error: 'El email ya está registrado' });
        
        const fortaleza = validarFortalezaPassword(password);
        if (fortaleza.nivel === 'Débil') {
            return res.status(400).json({ error: 'La contraseña es demasiado débil' });
        }
        
        const usuario = await Usuario.create({ nombre, email, password, password_strength: fortaleza.nivel });
        
        const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '8h' });
        
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token,
            usuario: { id: usuario.id, nombre, email, rol: usuario.rol }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// POST - Login
export const login = async (req, res) => {
    try {
        const { email, password, captcha, captchaId } = req.body;
        const id = captchaId || req.headers['x-captcha-id'];
        const ip = req.ip;
        const browser = req.headers['user-agent'];
        
        if (!captchaStore[id] || captcha !== captchaStore[id]) {
            return res.status(400).json({ error: 'CAPTCHA incorrecto' });
        }
        delete captchaStore[id];
        
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        const passwordValida = await usuario.validarPassword(password);
        if (!passwordValida) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        await LogAcceso.create({ usuario_id: usuario.id, usuario_email: email, evento: 'ingreso', ip, browser });
        
        const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '8h' });
        
        res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario.id, nombre: usuario.nombre, email, rol: usuario.rol } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// POST - Logout
export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            await LogAcceso.create({ usuario_id: decoded.id, usuario_email: decoded.email, evento: 'salida', ip: req.ip, browser: req.headers['user-agent'] });
        }
        res.json({ mensaje: 'Sesión cerrada' });
    } catch (error) {
        res.json({ mensaje: 'Sesión cerrada' });
    }
};

// GET - Verificar token
export const verificar = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valido: false });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valido: true, usuario: decoded });
    } catch {
        res.status(401).json({ valido: false });
    }
};